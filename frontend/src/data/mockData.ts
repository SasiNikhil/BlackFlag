import datasetNamesJson from './datasetNames.json'
import { Employee, LeaveBalance, LeaveRequest, Document, User, Message } from '../types'

// ---------- Generated helpers for bulk demo users ----------
const CREDENTIAL_USER_COUNT = 100 // number of login-ready users
const EMPLOYEE_COUNT = 10000 // total generated employees for directory/dashboard
const BULK_PASSWORD = 'Staff123!'
const BULK_START_INDEX = 14 // continue after EMP013

// Explicit credential set for first 100 accounts (password is shared via BULK_PASSWORD)
const credentialProfiles: { first: string; last: string; email: string }[] = [
  { first: 'Georgi', last: 'Facello', email: 'georgi.facello@blackflag.hr' },
  { first: 'Bezalel', last: 'Simmel', email: 'bezalel.simmel@blackflag.hr' },
  { first: 'Parto', last: 'Bamford', email: 'parto.bamford@blackflag.hr' },
  { first: 'Chirstian', last: 'Koblick', email: 'chirstian.koblick@blackflag.hr' },
  { first: 'Kyoichi', last: 'Maliniak', email: 'kyoichi.maliniak@blackflag.hr' },
  { first: 'Anneke', last: 'Preusig', email: 'anneke.preusig@blackflag.hr' },
  { first: 'Tzvetan', last: 'Zielinski', email: 'tzvetan.zielinski@blackflag.hr' },
  { first: 'Saniya', last: 'Kalloufi', email: 'saniya.kalloufi@blackflag.hr' },
  { first: 'Sumant', last: 'Peac', email: 'sumant.peac@blackflag.hr' },
  { first: 'Duangkaew', last: 'Piveteau', email: 'duangkaew.piveteau@blackflag.hr' },
  { first: 'Mary', last: 'Sluis', email: 'mary.sluis@blackflag.hr' },
  { first: 'Patricio', last: 'Bridgland', email: 'patricio.bridgland@blackflag.hr' },
  { first: 'Eberhardt', last: 'Terkki', email: 'eberhardt.terkki@blackflag.hr' },
  { first: 'Berni', last: 'Genin', email: 'berni.genin@blackflag.hr' },
  { first: 'Guoxiang', last: 'Nooteboom', email: 'guoxiang.nooteboom@blackflag.hr' },
  { first: 'Kazuhito', last: 'Cappelletti', email: 'kazuhito.cappelletti@blackflag.hr' },
  { first: 'Cristinel', last: 'Bouloucos', email: 'cristinel.bouloucos@blackflag.hr' },
  { first: 'Kazuhide', last: 'Peha', email: 'kazuhide.peha@blackflag.hr' },
  { first: 'Lillian', last: 'Haddadi', email: 'lillian.haddadi@blackflag.hr' },
  { first: 'Mayuko', last: 'Warwick', email: 'mayuko.warwick@blackflag.hr' },
  { first: 'Ramzi', last: 'Erde', email: 'ramzi.erde@blackflag.hr' },
  { first: 'Shahaf', last: 'Famili', email: 'shahaf.famili@blackflag.hr' },
  { first: 'Bojan', last: 'Montemayor', email: 'bojan.montemayor@blackflag.hr' },
  { first: 'Suzette', last: 'Pettey', email: 'suzette.pettey@blackflag.hr' },
  { first: 'Prasadram', last: 'Heyers', email: 'prasadram.heyers@blackflag.hr' },
  { first: 'Yongqiao', last: 'Berztiss', email: 'yongqiao.berztiss@blackflag.hr' },
  { first: 'Divier', last: 'Reistad', email: 'divier.reistad@blackflag.hr' },
  { first: 'Domenick', last: 'Tempesti', email: 'domenick.tempesti@blackflag.hr' },
  { first: 'Otmar', last: 'Herbst', email: 'otmar.herbst@blackflag.hr' },
  { first: 'Elvis', last: 'Demeyer', email: 'elvis.demeyer@blackflag.hr' },
  { first: 'Karsten', last: 'Joslin', email: 'karsten.joslin@blackflag.hr' },
  { first: 'Jeong', last: 'Reistad', email: 'jeong.reistad@blackflag.hr' },
  { first: 'Arif', last: 'Merlo', email: 'arif.merlo@blackflag.hr' },
  { first: 'Bader', last: 'Swan', email: 'bader.swan@blackflag.hr' },
  { first: 'Alain', last: 'Chappelet', email: 'alain.chappelet@blackflag.hr' },
  { first: 'Adamantios', last: 'Portugali', email: 'adamantios.portugali@blackflag.hr' },
  { first: 'Pradeep', last: 'Makrucki', email: 'pradeep.makrucki@blackflag.hr' },
  { first: 'Huan', last: 'Lortz', email: 'huan.lortz@blackflag.hr' },
  { first: 'Alejandro', last: 'Brender', email: 'alejandro.brender@blackflag.hr' },
  { first: 'Weiyi', last: 'Meriste', email: 'weiyi.meriste@blackflag.hr' },
  { first: 'Uri', last: 'Lenart', email: 'uri.lenart@blackflag.hr' },
  { first: 'Magy', last: 'Stamatiou', email: 'magy.stamatiou@blackflag.hr' },
  { first: 'Yishay', last: 'Tzvieli', email: 'yishay.tzvieli@blackflag.hr' },
  { first: 'Mingsen', last: 'Casley', email: 'mingsen.casley@blackflag.hr' },
  { first: 'Moss', last: 'Shanbhogue', email: 'moss.shanbhogue@blackflag.hr' },
  { first: 'Lucien', last: 'Rosenbaum', email: 'lucien.rosenbaum@blackflag.hr' },
  { first: 'Zvonko', last: 'Nyanchama', email: 'zvonko.nyanchama@blackflag.hr' },
  { first: 'Florian', last: 'Syrotiuk', email: 'florian.syrotiuk@blackflag.hr' },
  { first: 'Basil', last: 'Tramer', email: 'basil.tramer@blackflag.hr' },
  { first: 'Yinghua', last: 'Dredge', email: 'yinghua.dredge@blackflag.hr' },
  { first: 'Hidefumi', last: 'Caine', email: 'hidefumi.caine@blackflag.hr' },
  { first: 'Heping', last: 'Nitsch', email: 'heping.nitsch@blackflag.hr' },
  { first: 'Sanjiv', last: 'Zschoche', email: 'sanjiv.zschoche@blackflag.hr' },
  { first: 'Mayumi', last: 'Schueller', email: 'mayumi.schueller@blackflag.hr' },
  { first: 'Georgy', last: 'Dredge', email: 'georgy.dredge@blackflag.hr' },
  { first: 'Brendon', last: 'Bernini', email: 'brendon.bernini@blackflag.hr' },
  { first: 'Ebbe', last: 'Callaway', email: 'ebbe.callaway@blackflag.hr' },
  { first: 'Berhard', last: 'McFarlin', email: 'berhard.mcfarlin@blackflag.hr' },
  { first: 'Alejandro', last: 'McAlpine', email: 'alejandro.mcalpine@blackflag.hr' },
  { first: 'Breannda', last: 'Billingsley', email: 'breannda.billingsley@blackflag.hr' },
  { first: 'Tse', last: 'Herber', email: 'tse.herber@blackflag.hr' },
  { first: 'Anoosh', last: 'Peyn', email: 'anoosh.peyn@blackflag.hr' },
  { first: 'Gino', last: 'Leonhardt', email: 'gino.leonhardt@blackflag.hr' },
  { first: 'Udi', last: 'Jansch', email: 'udi.jansch@blackflag.hr' },
  { first: 'Satosi', last: 'Awdeh', email: 'satosi.awdeh@blackflag.hr' },
  { first: 'Kwee', last: 'Schusler', email: 'kwee.schusler@blackflag.hr' },
  { first: 'Claudi', last: 'Stavenow', email: 'claudi.stavenow@blackflag.hr' },
  { first: 'Charlene', last: 'Brattka', email: 'charlene.brattka@blackflag.hr' },
  { first: 'Margareta', last: 'Bierman', email: 'margareta.bierman@blackflag.hr' },
  { first: 'Reuven', last: 'Garigliano', email: 'reuven.garigliano@blackflag.hr' },
  { first: 'Hisao', last: 'Lipner', email: 'hisao.lipner@blackflag.hr' },
  { first: 'Hironoby', last: 'Sidou', email: 'hironoby.sidou@blackflag.hr' },
  { first: 'Shir', last: 'McClurg', email: 'shir.mcclurg@blackflag.hr' },
  { first: 'Mokhtar', last: 'Bernatsky', email: 'mokhtar.bernatsky@blackflag.hr' },
  { first: 'Gao', last: 'Dolinsky', email: 'gao.dolinsky@blackflag.hr' },
  { first: 'Erez', last: 'Ritzmann', email: 'erez.ritzmann@blackflag.hr' },
  { first: 'Mona', last: 'Azuma', email: 'mona.azuma@blackflag.hr' },
  { first: 'Danel', last: 'Mondadori', email: 'danel.mondadori@blackflag.hr' },
  { first: 'Kshitij', last: 'Gils', email: 'kshitij.gils@blackflag.hr' },
  { first: 'Premal', last: 'Baek', email: 'premal.baek@blackflag.hr' },
  { first: 'Zhongwei', last: 'Rosen', email: 'zhongwei.rosen@blackflag.hr' },
  { first: 'Parviz', last: 'Lortz', email: 'parviz.lortz@blackflag.hr' },
  { first: 'Vishv', last: 'Zockler', email: 'vishv.zockler@blackflag.hr' },
  { first: 'Tuval', last: 'Kalloufi', email: 'tuval.kalloufi@blackflag.hr' },
  { first: 'Kenroku', last: 'Malabarba', email: 'kenroku.malabarba@blackflag.hr' },
  { first: 'Somnath', last: 'Foote', email: 'somnath.foote@blackflag.hr' },
  { first: 'Xinglin', last: 'Eugenio', email: 'xinglin.eugenio@blackflag.hr' },
  { first: 'Jungsoon', last: 'Syrzycki', email: 'jungsoon.syrzycki@blackflag.hr' },
  { first: 'Sudharsan', last: 'Flasterstein', email: 'sudharsan.flasterstein@blackflag.hr' },
  { first: 'Kendra', last: 'Hofting', email: 'kendra.hofting@blackflag.hr' },
  { first: 'Amabile', last: 'Gomatam', email: 'amabile.gomatam@blackflag.hr' },
  { first: 'Valdiodio', last: 'Niizuma', email: 'valdiodio.niizuma@blackflag.hr' },
  { first: 'Sailaja', last: 'Desikan', email: 'sailaja.desikan@blackflag.hr' },
  { first: 'Arumugam', last: 'Ossenbruggen', email: 'arumugam.ossenbruggen@blackflag.hr' },
  { first: 'Hilari', last: 'Morton', email: 'hilari.morton@blackflag.hr' },
  { first: 'Jayson', last: 'Mandell', email: 'jayson.mandell@blackflag.hr' },
  { first: 'Remzi', last: 'Waschkowski', email: 'remzi.waschkowski@blackflag.hr' },
  { first: 'Sreekrishna', last: 'Servieres', email: 'sreekrishna.servieres@blackflag.hr' },
  { first: 'Valter', last: 'Sullins', email: 'valter.sullins@blackflag.hr' },
  { first: 'Hironobu', last: 'Haraldson', email: 'hironobu.haraldson@blackflag.hr' },
]

type GeneratedData = {
  users: { email: string; password: string; role: 'employee' }[]
  employees: Employee[]
  leaveBalances: LeaveBalance[]
  messages: Message[]
}

const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'Support']
const positions = ['Engineer', 'Analyst', 'Coordinator', 'Associate', 'Specialist', 'Consultant']

const salaryBandByDept: Record<string, [number, number]> = {
  Engineering: [110000, 185000],
  Sales: [90000, 165000],
  Marketing: [85000, 150000],
  Finance: [95000, 170000],
  Operations: [85000, 140000],
  Support: [70000, 120000],
}

const positionBump: Record<string, number> = {
  Engineer: 15000,
  Analyst: 5000,
  Coordinator: -3000,
  Associate: -5000,
  Specialist: 8000,
  Consultant: 12000,
}

const pickSalary = (dept: string, pos: string, index: number): number => {
  const [min, max] = salaryBandByDept[dept] || [80000, 140000]
  const step = (max - min) / 12
  const base = min + step * (index % 12)
  const bump = positionBump[pos] || 0
  const variance = (index % 5) * 750 + (index % 3) * 500
  return Math.round(base + bump + variance)
}

// Real employee names pulled from test_db dump (first 10,000 rows)
const names = datasetNamesJson as { first: string; last: string }[]

const generateBulkData = (employeeCount: number, credentialCount: number): GeneratedData => {
  const users: GeneratedData['users'] = []
  const employees: Employee[] = []
  const leaveBalances: LeaveBalance[] = []
  const messages: Message[] = []

  for (let i = 0; i < employeeCount; i++) {
    const idx = BULK_START_INDEX + i
    const empId = `EMP${String(idx).padStart(3, '0')}`
    const id = `emp-${String(idx).padStart(3, '0')}`
    const profile = credentialProfiles[i]
    const name = profile || names[i % names.length] || { first: 'Employee', last: `${i + 1}` }
    const first = name.first
    const last = name.last
    const email = profile
      ? profile.email
      : `${first.toLowerCase()}.${last.toLowerCase()}${String(i + 1).padStart(4, '0')}@blackflag.hr`
    const dept = departments[i % departments.length]
    const pos = positions[i % positions.length]

    // Only the first `credentialCount` generated employees get credentials
    if (i < credentialCount) {
      users.push({ email, password: BULK_PASSWORD, role: 'employee' })
    }

    employees.push({
      id,
      employee_id: empId,
      email,
      first_name: first,
      last_name: last,
      department: dept,
      position: pos,
      phone: `+1-555-200-${String(1000 + i).slice(-4)}`,
      address: `${100 + i} Market St, San Francisco, CA 94105`,
      salary: pickSalary(dept, pos, i),
      ssn: '***-**-0000',
      manager_id: null,
      is_active: true,
      hire_date: '2023-06-01',
      created_at: '2023-06-01T09:00:00Z',
      updated_at: '2024-12-01T09:00:00Z',
    })

    // Basic leave balances (vacation/sick)
    leaveBalances.push({
      id: `lb-${String(idx).padStart(3, '0')}-v`,
      employee_id: id,
      leave_type: 'vacation',
      year: 2024,
      accrued: 15,
      used: (i % 5),
      carried_over: 2,
    })
    leaveBalances.push({
      id: `lb-${String(idx).padStart(3, '0')}-s`,
      employee_id: id,
      leave_type: 'sick',
      year: 2024,
      accrued: 8,
      used: (i % 3),
      carried_over: 1,
    })

    // Active real-time messaging between generated users
    // Each user sends/receives multiple messages to create active conversations
    // Messages intentionally omitted to keep inbox clean
  }

  return { users, employees, leaveBalances, messages }
}

const bulk = generateBulkData(EMPLOYEE_COUNT, CREDENTIAL_USER_COUNT)

// ---------- Base test users ----------
const baseTestUsers = [
  // HR Admins
  { email: 'sarah.chen@blackflag.hr', password: 'Admin123!', role: 'hr_admin' as const },
  { email: 'hr.manager@blackflag.hr', password: 'HRPass123!', role: 'hr_admin' as const },
]

// Exported test users (base HR admins + first 100 generated employees)
export const testUsers = [...baseTestUsers, ...bulk.users]

// Current logged-in user (HR Admin for demo) - Always Sarah Chen
export const currentUser: User = {
  id: 'emp-001',
  employee_id: 'EMP001',
  email: 'sarah.chen@blackflag.hr',
  first_name: 'Sarah',
  last_name: 'Chen',
  role: 'hr_admin',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
}

// Mock employees data
// Base HR admin employees only
const baseEmployees: Employee[] = [
  {
    id: 'emp-001',
    employee_id: 'EMP001',
    email: 'sarah.chen@blackflag.hr',
    first_name: 'Sarah',
    last_name: 'Chen',
    department: 'Human Resources',
    position: 'HR Director',
    phone: '+1-415-555-0147',
    address: '2847 Evergreen Terrace, San Francisco, CA 94107',
    salary: 175000,
    ssn: '***-**-7890',
    manager_id: null,
    is_active: true,
    hire_date: '2019-08-20',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    created_at: '2019-08-20T08:30:00Z',
    updated_at: '2024-12-06T10:15:00Z',
  },
  {
    id: 'emp-013',
    employee_id: 'EMP013',
    email: 'hr.manager@blackflag.hr',
    first_name: 'Patricia',
    last_name: 'Anderson',
    department: 'Human Resources',
    position: 'HR Manager',
    phone: '+1 (555) 100-0013',
    address: '1313 Valencia St, San Francisco, CA 94110',
    salary: 135000,
    ssn: '***-**-3344',
    manager_id: 'emp-001',
    is_active: true,
    hire_date: '2020-03-15',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patricia',
    created_at: '2020-03-15T09:00:00Z',
    updated_at: '2024-02-28T10:00:00Z',
  },
]

export const initialEmployees: Employee[] = [...baseEmployees, ...bulk.employees]

// Mock leave balances for all employees
export const initialLeaveBalances: LeaveBalance[] = [
  // Sarah Chen (emp-001)
  {
    id: 'lb-001',
    employee_id: 'emp-001',
    leave_type: 'vacation',
    year: 2024,
    accrued: 20,
    used: 8,
    carried_over: 5,
  },
  // Generated employees
  ...bulk.leaveBalances,
  {
    id: 'lb-002',
    employee_id: 'emp-001',
    leave_type: 'sick',
    year: 2024,
    accrued: 10,
    used: 3,
    carried_over: 1,
  },
  {
    id: 'lb-003',
    employee_id: 'emp-001',
    leave_type: 'personal',
    year: 2024,
    accrued: 3,
    used: 0,
    carried_over: 0,
  },
  {
    id: 'lb-004',
    employee_id: 'emp-001',
    leave_type: 'bereavement',
    year: 2024,
    accrued: 5,
    used: 0,
    carried_over: 0,
  },
  // Marcus Johnson (emp-002)
  {
    id: 'lb-005',
    employee_id: 'emp-002',
    leave_type: 'vacation',
    year: 2024,
    accrued: 20,
    used: 12,
    carried_over: 0,
  },
  {
    id: 'lb-006',
    employee_id: 'emp-002',
    leave_type: 'sick',
    year: 2024,
    accrued: 10,
    used: 2,
    carried_over: 0,
  },
  {
    id: 'lb-007',
    employee_id: 'emp-002',
    leave_type: 'personal',
    year: 2024,
    accrued: 3,
    used: 1,
    carried_over: 0,
  },
  {
    id: 'lb-008',
    employee_id: 'emp-002',
    leave_type: 'bereavement',
    year: 2024,
    accrued: 5,
    used: 0,
    carried_over: 0,
  },
  // Emily Rodriguez (emp-003)
  {
    id: 'lb-009',
    employee_id: 'emp-003',
    leave_type: 'vacation',
    year: 2024,
    accrued: 20,
    used: 5,
    carried_over: 2,
  },
  {
    id: 'lb-010',
    employee_id: 'emp-003',
    leave_type: 'sick',
    year: 2024,
    accrued: 10,
    used: 4,
    carried_over: 0,
  },
  {
    id: 'lb-011',
    employee_id: 'emp-003',
    leave_type: 'personal',
    year: 2024,
    accrued: 3,
    used: 2,
    carried_over: 0,
  },
  {
    id: 'lb-012',
    employee_id: 'emp-003',
    leave_type: 'bereavement',
    year: 2024,
    accrued: 5,
    used: 0,
    carried_over: 0,
  },
  // David Kim (emp-004)
  {
    id: 'lb-013',
    employee_id: 'emp-004',
    leave_type: 'vacation',
    year: 2024,
    accrued: 20,
    used: 10,
    carried_over: 3,
  },
  {
    id: 'lb-014',
    employee_id: 'emp-004',
    leave_type: 'sick',
    year: 2024,
    accrued: 10,
    used: 1,
    carried_over: 1,
  },
  {
    id: 'lb-015',
    employee_id: 'emp-004',
    leave_type: 'personal',
    year: 2024,
    accrued: 3,
    used: 0,
    carried_over: 0,
  },
  {
    id: 'lb-016',
    employee_id: 'emp-004',
    leave_type: 'bereavement',
    year: 2024,
    accrued: 5,
    used: 0,
    carried_over: 0,
  },
  // Patricia Anderson / HR Manager (emp-013)
  {
    id: 'lb-017',
    employee_id: 'emp-013',
    leave_type: 'vacation',
    year: 2024,
    accrued: 20,
    used: 6,
    carried_over: 4,
  },
  {
    id: 'lb-018',
    employee_id: 'emp-013',
    leave_type: 'sick',
    year: 2024,
    accrued: 10,
    used: 2,
    carried_over: 1,
  },
  {
    id: 'lb-019',
    employee_id: 'emp-013',
    leave_type: 'personal',
    year: 2024,
    accrued: 3,
    used: 1,
    carried_over: 0,
  },
  {
    id: 'lb-020',
    employee_id: 'emp-013',
    leave_type: 'bereavement',
    year: 2024,
    accrued: 5,
    used: 0,
    carried_over: 0,
  },
]

// Mock leave requests
export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr-001',
    employee_id: 'emp-002',
    leave_type: 'vacation',
    start_date: '2024-12-20',
    end_date: '2024-12-27',
    hours: 40,
    status: 'pending',
    notes: 'Holiday vacation with family',
    approved_by: null,
    created_at: '2024-11-15T10:00:00Z',
    updated_at: '2024-11-15T10:00:00Z',
  },
  {
    id: 'lr-002',
    employee_id: 'emp-003',
    leave_type: 'sick',
    start_date: '2024-11-25',
    end_date: '2024-11-26',
    hours: 16,
    status: 'approved',
    notes: 'Doctor appointment and recovery',
    approved_by: 'emp-001',
    created_at: '2024-11-20T09:00:00Z',
    updated_at: '2024-11-20T14:00:00Z',
  },
  {
    id: 'lr-003',
    employee_id: 'emp-004',
    leave_type: 'personal',
    start_date: '2024-12-15',
    end_date: '2024-12-15',
    hours: 8,
    status: 'pending',
    notes: 'Personal errand',
    approved_by: null,
    created_at: '2024-11-28T11:00:00Z',
    updated_at: '2024-11-28T11:00:00Z',
  },
  {
    id: 'lr-004',
    employee_id: 'emp-001',
    leave_type: 'vacation',
    start_date: '2024-11-28',
    end_date: '2024-11-29',
    hours: 16,
    status: 'approved',
    notes: 'Thanksgiving break',
    approved_by: 'emp-001',
    created_at: '2024-11-01T09:00:00Z',
    updated_at: '2024-11-05T10:00:00Z',
  },
  {
    id: 'lr-005',
    employee_id: 'emp-007',
    leave_type: 'vacation',
    start_date: '2024-12-23',
    end_date: '2025-01-03',
    hours: 64,
    status: 'pending',
    notes: 'Winter holiday',
    approved_by: null,
    created_at: '2024-11-30T15:00:00Z',
    updated_at: '2024-11-30T15:00:00Z',
  },
]

// Mock documents
export const initialDocuments: Document[] = [
  {
    id: 'doc-001',
    employee_id: 'emp-001',
    document_type: 'id',
    filename: 'CA_Drivers_License.pdf',
    file_size: 542000,
    uploaded_by: 'emp-001',
    expiry_date: '2028-08-15',
    created_at: '2019-08-20T10:00:00Z',
  },
  {
    id: 'doc-002',
    employee_id: 'emp-001',
    document_type: 'offer_letter',
    filename: 'Offer_Letter_Sarah_Chen_2019.pdf',
    file_size: 285000,
    uploaded_by: 'emp-001',
    expiry_date: null,
    created_at: '2019-08-15T09:00:00Z',
  },
  {
    id: 'doc-003',
    employee_id: 'emp-001',
    document_type: 'contract',
    filename: 'Employment_Agreement.pdf',
    file_size: 412000,
    uploaded_by: 'emp-001',
    expiry_date: null,
    created_at: '2019-08-20T11:00:00Z',
  },
  {
    id: 'doc-004',
    employee_id: 'emp-001',
    document_type: 'tax_form',
    filename: '2024_W2_Form.pdf',
    file_size: 325000,
    uploaded_by: 'hr-system',
    expiry_date: null,
    created_at: '2025-01-15T08:00:00Z',
  },
  {
    id: 'doc-005',
    employee_id: 'emp-001',
    document_type: 'certification',
    filename: 'SHRM_Certification_2023.pdf',
    file_size: 456000,
    uploaded_by: 'emp-001',
    expiry_date: '2026-06-30',
    created_at: '2023-06-15T14:00:00Z',
  },
  {
    id: 'doc-006',
    employee_id: 'emp-001',
    document_type: 'tax_form',
    filename: 'W4_2024.pdf',
    file_size: 128000,
    uploaded_by: 'emp-001',
    expiry_date: null,
    created_at: '2024-01-02T10:30:00Z',
  },
  {
    id: 'doc-007',
    employee_id: 'emp-002',
    document_type: 'certification',
    filename: 'AWS_Solutions_Architect.pdf',
    file_size: 512000,
    uploaded_by: 'emp-002',
    expiry_date: '2026-06-15',
    created_at: '2024-02-20T14:00:00Z',
  },
  {
    id: 'doc-008',
    employee_id: 'emp-004',
    document_type: 'certification',
    filename: 'Kubernetes_Admin_Cert.pdf',
    file_size: 456000,
    uploaded_by: 'emp-004',
    expiry_date: '2025-09-01',
    created_at: '2023-09-01T09:00:00Z',
  },
  // Documents for Marcus Johnson (emp-002)
  {
    id: 'doc-009',
    employee_id: 'emp-002',
    document_type: 'id',
    filename: 'NY_Drivers_License.pdf',
    file_size: 485000,
    uploaded_by: 'emp-002',
    expiry_date: '2028-05-10',
    created_at: '2021-06-01T09:00:00Z',
  },
  {
    id: 'doc-010',
    employee_id: 'emp-002',
    document_type: 'offer_letter',
    filename: 'Offer_Letter_Marcus_Johnson_2021.pdf',
    file_size: 298000,
    uploaded_by: 'emp-001',
    expiry_date: null,
    created_at: '2021-05-28T10:00:00Z',
  },
  {
    id: 'doc-011',
    employee_id: 'emp-002',
    document_type: 'tax_form',
    filename: '2024_W2_Form.pdf',
    file_size: 335000,
    uploaded_by: 'hr-system',
    expiry_date: null,
    created_at: '2025-01-15T08:00:00Z',
  },
  {
    id: 'doc-012',
    employee_id: 'emp-002',
    document_type: 'contract',
    filename: 'Employment_Agreement.pdf',
    file_size: 389000,
    uploaded_by: 'emp-001',
    expiry_date: null,
    created_at: '2021-06-01T09:30:00Z',
  },
  // Documents for Emily Rodriguez (emp-003)
  {
    id: 'doc-013',
    employee_id: 'emp-003',
    document_type: 'id',
    filename: 'TX_Drivers_License.pdf',
    file_size: 512000,
    uploaded_by: 'emp-003',
    expiry_date: '2027-12-20',
    created_at: '2022-01-10T09:00:00Z',
  },
  {
    id: 'doc-014',
    employee_id: 'emp-003',
    document_type: 'offer_letter',
    filename: 'Offer_Letter_Emily_Rodriguez_2022.pdf',
    file_size: 276000,
    uploaded_by: 'emp-001',
    expiry_date: null,
    created_at: '2022-01-05T11:00:00Z',
  },
  {
    id: 'doc-015',
    employee_id: 'emp-003',
    document_type: 'certification',
    filename: 'Sales_Excellence_Certification_2023.pdf',
    file_size: 398000,
    uploaded_by: 'emp-003',
    expiry_date: '2025-08-15',
    created_at: '2023-08-15T14:00:00Z',
  },
  {
    id: 'doc-016',
    employee_id: 'emp-003',
    document_type: 'tax_form',
    filename: '2024_W2_Form.pdf',
    file_size: 318000,
    uploaded_by: 'hr-system',
    expiry_date: null,
    created_at: '2025-01-15T08:00:00Z',
  },
  // Documents for David Kim (emp-004)
  {
    id: 'doc-017',
    employee_id: 'emp-004',
    document_type: 'id',
    filename: 'CA_Drivers_License.pdf',
    file_size: 498000,
    uploaded_by: 'emp-004',
    expiry_date: '2027-09-12',
    created_at: '2021-09-15T09:00:00Z',
  },
  {
    id: 'doc-018',
    employee_id: 'emp-004',
    document_type: 'offer_letter',
    filename: 'Offer_Letter_David_Kim_2021.pdf',
    file_size: 288000,
    uploaded_by: 'emp-001',
    expiry_date: null,
    created_at: '2021-09-10T10:00:00Z',
  },
  {
    id: 'doc-019',
    employee_id: 'emp-004',
    document_type: 'contract',
    filename: 'Employment_Agreement.pdf',
    file_size: 405000,
    uploaded_by: 'emp-001',
    expiry_date: null,
    created_at: '2021-09-15T09:30:00Z',
  },
  {
    id: 'doc-020',
    employee_id: 'emp-004',
    document_type: 'tax_form',
    filename: '2024_W2_Form.pdf',
    file_size: 322000,
    uploaded_by: 'hr-system',
    expiry_date: null,
    created_at: '2025-01-15T08:00:00Z',
  },
  // Documents for Patricia Anderson / HR Manager (emp-013)
  {
    id: 'doc-021',
    employee_id: 'emp-013',
    document_type: 'id',
    filename: 'CA_Drivers_License.pdf',
    file_size: 520000,
    uploaded_by: 'emp-013',
    expiry_date: '2029-01-05',
    created_at: '2020-03-15T09:00:00Z',
  },
  {
    id: 'doc-022',
    employee_id: 'emp-013',
    document_type: 'offer_letter',
    filename: 'Offer_Letter_Patricia_Anderson_2020.pdf',
    file_size: 292000,
    uploaded_by: 'emp-001',
    expiry_date: null,
    created_at: '2020-03-10T10:00:00Z',
  },
  {
    id: 'doc-023',
    employee_id: 'emp-013',
    document_type: 'certification',
    filename: 'CIPHR_HR_Certification_2021.pdf',
    file_size: 475000,
    uploaded_by: 'emp-013',
    expiry_date: '2026-11-30',
    created_at: '2021-11-30T14:00:00Z',
  },
  {
    id: 'doc-024',
    employee_id: 'emp-013',
    document_type: 'contract',
    filename: 'Employment_Agreement.pdf',
    file_size: 418000,
    uploaded_by: 'emp-001',
    expiry_date: null,
    created_at: '2020-03-15T09:30:00Z',
  },
  {
    id: 'doc-025',
    employee_id: 'emp-013',
    document_type: 'tax_form',
    filename: '2024_W2_Form.pdf',
    file_size: 330000,
    uploaded_by: 'hr-system',
    expiry_date: null,
    created_at: '2025-01-15T08:00:00Z',
  },
  {
    id: 'doc-026',
    employee_id: 'emp-013',
    document_type: 'certification',
    filename: 'Advanced_HR_Management_2023.pdf',
    file_size: 487000,
    uploaded_by: 'emp-013',
    expiry_date: '2025-12-15',
    created_at: '2023-12-15T13:00:00Z',
  },
]

// Mock messages (empty to start with a clean inbox)
export const initialMessages: Message[] = []

// Helper to generate new IDs
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper to generate employee ID
export const generateEmployeeId = (employees: Employee[]): string => {
  const maxNum = employees.reduce((max, emp) => {
    const num = parseInt(emp.employee_id.replace('EMP', ''), 10)
    return num > max ? num : max
  }, 0)
  return `EMP${String(maxNum + 1).padStart(3, '0')}`
}

