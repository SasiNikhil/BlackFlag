import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  Employee,
  LeaveBalance,
  LeaveRequest,
  Document,
  User,
  EmployeeFormData,
  LeaveStatus,
  DocumentType,
  Message,
} from '../types'
import {
  initialEmployees,
  initialLeaveBalances,
  initialLeaveRequests,
  initialDocuments,
  initialMessages,
  currentUser,
  testUsers,
  generateId,
  generateEmployeeId,
} from '../data/mockData'
import { getEmployees } from '../services/api'

// Toggle API usage; default to mock data to keep the curated 100 users
const USE_API = import.meta.env.VITE_USE_API === 'true'

const ensureTestProfiles = (list: Employee[]): Employee[] => {
  const emailSet = new Set(list.map(e => e.email.toLowerCase()))
  const extras = initialEmployees.filter(emp =>
    testUsers.some(t => t.email.toLowerCase() === emp.email.toLowerCase()) && !emailSet.has(emp.email.toLowerCase())
  )
  return extras.length ? [...list, ...extras] : list
}

interface AppContextType {
  // User
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void

  // Employees
  employees: Employee[]
  addEmployee: (data: EmployeeFormData) => Employee
  updateEmployee: (id: string, data: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  getEmployee: (id: string) => Employee | undefined

  // Leave
  leaveBalances: LeaveBalance[]
  leaveRequests: LeaveRequest[]
  addLeaveRequest: (data: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at' | 'status' | 'approved_by'>) => LeaveRequest
  updateLeaveStatus: (id: string, status: LeaveStatus, approvedBy?: string) => void
  cancelLeaveRequest: (id: string) => void

  // Documents
  documents: Document[]
  addDocument: (data: { employee_id: string; document_type: DocumentType; filename: string; file_size: number; expiry_date?: string }) => Document
  deleteDocument: (id: string) => void

  // Messages
  messages: Message[]
  sendMessage: (toId: string, content: string) => Message
  markAsRead: (messageIds: string[]) => void
  getConversation: (participantId: string) => Message[]
  getUnreadCount: () => number

  // UI State
  notifications: Notification[]
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void
  clearNotification: (id: string) => void
}

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Bump storage key to invalidate older cached messages
const STORAGE_KEY = 'blackflag-hr-data-v3'
const OLD_STORAGE_KEY = 'blackflag-hr-data'
const PREV_STORAGE_KEY = 'blackflag-hr-data-v2'

interface StoredData {
  employees: Employee[]
  leaveBalances: LeaveBalance[]
  leaveRequests: LeaveRequest[]
  documents: Document[]
  messages: Message[]
  isAuthenticated: boolean
  user: User | null
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Load initial state from localStorage or use defaults
  const loadInitialState = (): Omit<StoredData, 'employees'> => {
    try {
      // Remove legacy storage to avoid stale seeded messages
      localStorage.removeItem(OLD_STORAGE_KEY)
      localStorage.removeItem(PREV_STORAGE_KEY)
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Handle migration: add missing fields (employees are NOT stored in localStorage)
        return {
          leaveBalances: parsed.leaveBalances || initialLeaveBalances,
          leaveRequests: parsed.leaveRequests || initialLeaveRequests,
          documents: parsed.documents || initialDocuments,
          // Always start with clean messages (empty inbox)
          messages: initialMessages,
          isAuthenticated: parsed.isAuthenticated || false,
          user: parsed.user || null,
        }
      }
    } catch (e) {
      console.error('Failed to load stored data:', e)
    }
    return {
      leaveBalances: initialLeaveBalances,
      leaveRequests: initialLeaveRequests,
      documents: initialDocuments,
      messages: initialMessages,
      isAuthenticated: false,
      user: null,
    }
  }

  const initialState = loadInitialState()

  const [user, setUser] = useState<User | null>(initialState.user)
  const [employees, setEmployees] = useState<Employee[]>([]) // Start with empty, fetch from API
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(initialState.leaveBalances)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialState.leaveRequests)
  const [documents, setDocuments] = useState<Document[]>(initialState.documents)
  const [messages, setMessages] = useState<Message[]>(initialState.messages)
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Fetch employees from API on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!USE_API) {
        setEmployees(initialEmployees)
        return
      }
      try {
        const data = await getEmployees(0, 10000) // Fetch first 10,000 employees
        // Map API response to frontend Employee type
        const mappedEmployees: Employee[] = data.map((emp: any) => ({
          id: emp.id.toString(),
          employee_id: emp.employee_id,
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          phone: emp.phone || '',
          department: emp.department || 'Unknown',
          position: emp.position || 'Employee',
          hire_date: emp.hire_date,
          is_active: emp.is_active,
          address: emp.address || '',
          salary: typeof emp.salary === 'number' ? emp.salary : 110000,
          ssn: '',
          manager_id: null,
          created_at: emp.created_at || emp.hire_date || new Date().toISOString(),
          updated_at: emp.updated_at || emp.created_at || emp.hire_date || new Date().toISOString(),
        }))
        const mergedEmployees = ensureTestProfiles(mappedEmployees)
        setEmployees(mergedEmployees)
      } catch (error) {
        console.error('Failed to fetch employees:', error)
        setEmployees(initialEmployees)
      }
    }
    fetchEmployees()
  }, [])

  // Persist to localStorage (exclude employees - too large for 10k records)
  useEffect(() => {
    try {
      const data = {
        leaveBalances,
        leaveRequests,
        documents,
        messages,
        isAuthenticated,
        user,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [leaveBalances, leaveRequests, documents, messages, isAuthenticated, user])

  // Auth functions
  const login = (email: string, password: string): boolean => {
    const testUser = testUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!testUser) {
      addNotification('Invalid email or password', 'error')
      return false
    }

    const baseEmployees = employees.length ? employees : ensureTestProfiles(initialEmployees)
    const matched = baseEmployees.find(e => e.email.toLowerCase() === email.toLowerCase())

    if (matched) {
      setUser({
        id: matched.id,
        employee_id: matched.employee_id,
        email: matched.email,
        first_name: matched.first_name,
        last_name: matched.last_name,
        role: testUser.role,
        avatar_url: matched.avatar_url,
      })
      setEmployees(prev => {
        const list = prev.length ? prev : baseEmployees
        return ensureTestProfiles(list)
      })
    } else {
      const mockEmp = initialEmployees.find(e => e.email.toLowerCase() === email.toLowerCase())
      if (mockEmp) {
        setUser({
          id: mockEmp.id,
          employee_id: mockEmp.employee_id,
          email: mockEmp.email,
          first_name: mockEmp.first_name,
          last_name: mockEmp.last_name,
          role: testUser.role,
          avatar_url: mockEmp.avatar_url,
        })
        setEmployees(prev => {
          const exists = prev.some(e => e.email.toLowerCase() === mockEmp.email.toLowerCase())
          return exists ? prev : [...prev, mockEmp]
        })
        setIsAuthenticated(true)
        addNotification(`Welcome back, ${mockEmp.first_name}!`, 'success')
        return true
      }
    }

    setIsAuthenticated(true)
    const userName = matched?.first_name || (testUser.role === 'hr_admin' ? 'HR Admin' : 'Team Member')
    addNotification(`Welcome back, ${userName}!`, 'success')
    return true
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    addNotification('You have been signed out.', 'info')
  }

  // Employee functions
  const addEmployee = (data: EmployeeFormData): Employee => {
    const newEmployee: Employee = {
      ...data,
      id: generateId('emp'),
      employee_id: generateEmployeeId(employees),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setEmployees([...employees, newEmployee])
    addNotification(`Employee ${data.first_name} ${data.last_name} added successfully.`, 'success')
    return newEmployee
  }

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(employees.map(emp =>
      emp.id === id
        ? { ...emp, ...data, updated_at: new Date().toISOString() }
        : emp
    ))
    addNotification('Employee updated successfully.', 'success')
  }

  const deleteEmployee = (id: string) => {
    setEmployees(employees.map(emp =>
      emp.id === id
        ? { ...emp, is_active: false, updated_at: new Date().toISOString() }
        : emp
    ))
    addNotification('Employee deactivated.', 'info')
  }

  const getEmployee = (id: string): Employee | undefined => {
    return employees.find(emp => emp.id === id)
  }

  // Leave functions
  const addLeaveRequest = (data: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at' | 'status' | 'approved_by'>): LeaveRequest => {
    const newRequest: LeaveRequest = {
      ...data,
      id: generateId('lr'),
      status: 'pending',
      approved_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setLeaveRequests([...leaveRequests, newRequest])
    addNotification('Leave request submitted.', 'success')
    return newRequest
  }

  const updateLeaveStatus = (id: string, status: LeaveStatus, approvedBy?: string) => {
    setLeaveRequests(leaveRequests.map(req =>
      req.id === id
        ? {
            ...req,
            status,
            approved_by: approvedBy || req.approved_by,
            updated_at: new Date().toISOString(),
          }
        : req
    ))

    // Update leave balance if approved
    if (status === 'approved') {
      const request = leaveRequests.find(r => r.id === id)
      if (request) {
        setLeaveBalances(leaveBalances.map(bal =>
          bal.employee_id === request.employee_id && bal.leave_type === request.leave_type
            ? { ...bal, used: bal.used + (request.hours / 8) }
            : bal
        ))
      }
    }

    addNotification(`Leave request ${status}.`, status === 'approved' ? 'success' : 'info')
  }

  const cancelLeaveRequest = (id: string) => {
    updateLeaveStatus(id, 'cancelled')
  }

  // Document functions
  const addDocument = (data: { employee_id: string; document_type: DocumentType; filename: string; file_size: number; expiry_date?: string }): Document => {
    const newDoc: Document = {
      id: generateId('doc'),
      employee_id: data.employee_id,
      document_type: data.document_type,
      filename: data.filename,
      file_size: data.file_size,
      uploaded_by: user?.id || currentUser.id,
      expiry_date: data.expiry_date || null,
      created_at: new Date().toISOString(),
    }
    setDocuments([...documents, newDoc])
    addNotification('Document uploaded successfully.', 'success')
    return newDoc
  }

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id))
    addNotification('Document deleted.', 'info')
  }

  // Message functions
  const sendMessage = (toId: string, content: string): Message => {
    const newMessage: Message = {
      id: generateId('msg'),
      from_id: user?.id || currentUser.id,
      to_id: toId,
      content,
      read: false,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  const markAsRead = (messageIds: string[]) => {
    setMessages(prev => prev.map(msg =>
      messageIds.includes(msg.id) ? { ...msg, read: true } : msg
    ))
  }

  const getConversation = (participantId: string): Message[] => {
    if (!user) return []
    return messages
      .filter(msg =>
        (msg.from_id === user.id && msg.to_id === participantId) ||
        (msg.from_id === participantId && msg.to_id === user.id)
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  const getUnreadCount = (): number => {
    return user ? messages.filter(msg => msg.to_id === user.id && !msg.read).length : 0
  }

  // Notification functions
  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = generateId('notif')
    setNotifications(prev => [...prev, { id, message, type }])
    // Auto-remove after 5 seconds
    setTimeout(() => {
      clearNotification(id)
    }, 5000)
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployee,
        leaveBalances,
        leaveRequests,
        addLeaveRequest,
        updateLeaveStatus,
        cancelLeaveRequest,
        documents,
        addDocument,
        deleteDocument,
        messages,
        sendMessage,
        markAsRead,
        getConversation,
        getUnreadCount,
        notifications,
        addNotification,
        clearNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

