import { NextRequest, NextResponse } from 'next/server'

interface Biz360Event {
  eventType: 'employee_added' | 'employee_removed' | 'department_updated' | 'org_sync' | 'training_completed'
  timestamp: string
  companyId: string
  data: Record<string, unknown>
}

interface EmployeeData {
  employeeId: string
  name: string
  email: string
  department: string
  position: string
  hireDate: string
}

interface DepartmentData {
  departmentId: string
  name: string
  parentId?: string
  managerId?: string
}

interface TrainingData {
  employeeId: string
  courseId: string
  courseName: string
  completedDate: string
  score?: number
  certificateId?: string
}

// Biz360 웹훅 수신 엔드포인트
export async function POST(request: NextRequest) {
  try {
    // 웹훅 서명 검증 (실제로는 Biz360에서 제공하는 서명 검증)
    const signature = request.headers.get('x-biz360-signature')
    const webhookSecret = process.env.BIZ360_WEBHOOK_SECRET || 'test-secret'

    if (!signature) {
      console.warn('Missing webhook signature')
      // 개발 환경에서는 통과, 프로덕션에서는 거부
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: '유효하지 않은 요청입니다.' },
          { status: 401 }
        )
      }
    }

    const event: Biz360Event = await request.json()

    console.log(`[Biz360 Webhook] Received event: ${event.eventType}`, {
      companyId: event.companyId,
      timestamp: event.timestamp,
    })

    // 이벤트 타입별 처리
    switch (event.eventType) {
      case 'employee_added': {
        const employeeData = event.data as unknown as EmployeeData
        await handleEmployeeAdded(event.companyId, employeeData)
        break
      }

      case 'employee_removed': {
        const { employeeId } = event.data as { employeeId: string }
        await handleEmployeeRemoved(event.companyId, employeeId)
        break
      }

      case 'department_updated': {
        const departmentData = event.data as unknown as DepartmentData
        await handleDepartmentUpdated(event.companyId, departmentData)
        break
      }

      case 'org_sync': {
        const { employees, departments } = event.data as {
          employees: EmployeeData[]
          departments: DepartmentData[]
        }
        await handleOrgSync(event.companyId, employees, departments)
        break
      }

      case 'training_completed': {
        const trainingData = event.data as unknown as TrainingData
        await handleTrainingCompleted(event.companyId, trainingData)
        break
      }

      default:
        console.warn(`Unknown event type: ${event.eventType}`)
    }

    return NextResponse.json({
      success: true,
      message: '이벤트가 성공적으로 처리되었습니다.',
      eventType: event.eventType,
      processedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Biz360 webhook error:', error)
    return NextResponse.json(
      { error: '웹훅 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 웹훅 상태 확인 (Health check)
export async function GET(request: NextRequest) {
  const companyId = request.nextUrl.searchParams.get('companyId')

  // Mock 연동 상태 반환
  const integrationStatus = {
    connected: true,
    lastSync: '2024-01-20T09:00:00Z',
    syncedData: {
      employees: 41,
      departments: 6,
      trainingRecords: 156,
    },
    webhookUrl: `${request.nextUrl.origin}/api/biz360-webhook`,
    supportedEvents: [
      'employee_added',
      'employee_removed',
      'department_updated',
      'org_sync',
      'training_completed',
    ],
  }

  return NextResponse.json({
    success: true,
    data: integrationStatus,
  })
}

// === 이벤트 핸들러 함수들 ===

async function handleEmployeeAdded(companyId: string, employee: EmployeeData) {
  console.log(`[Employee Added] Company: ${companyId}, Employee: ${employee.name}`)

  // TODO: 실제 구현
  // 1. 직원 정보 DB에 저장
  // 2. 스킬 진단 초대 이메일 발송
  // 3. 대시보드 통계 업데이트

  // Mock 처리
  await simulateAsyncOperation()

  console.log(`Successfully processed new employee: ${employee.employeeId}`)
}

async function handleEmployeeRemoved(companyId: string, employeeId: string) {
  console.log(`[Employee Removed] Company: ${companyId}, Employee ID: ${employeeId}`)

  // TODO: 실제 구현
  // 1. 직원 정보 비활성화
  // 2. 진행 중인 교육 정리
  // 3. 대시보드 통계 업데이트

  await simulateAsyncOperation()

  console.log(`Successfully processed employee removal: ${employeeId}`)
}

async function handleDepartmentUpdated(companyId: string, department: DepartmentData) {
  console.log(`[Department Updated] Company: ${companyId}, Department: ${department.name}`)

  // TODO: 실제 구현
  // 1. 부서 정보 업데이트
  // 2. 소속 직원 정보 동기화
  // 3. 조직도 캐시 갱신

  await simulateAsyncOperation()

  console.log(`Successfully processed department update: ${department.departmentId}`)
}

async function handleOrgSync(
  companyId: string,
  employees: EmployeeData[],
  departments: DepartmentData[]
) {
  console.log(
    `[Org Sync] Company: ${companyId}, Employees: ${employees.length}, Departments: ${departments.length}`
  )

  // TODO: 실제 구현
  // 1. 전체 조직 데이터 동기화
  // 2. 신규/변경/삭제 항목 식별
  // 3. 배치 업데이트 수행

  await simulateAsyncOperation()

  console.log(`Successfully synced organization data for company: ${companyId}`)
}

async function handleTrainingCompleted(companyId: string, training: TrainingData) {
  console.log(
    `[Training Completed] Company: ${companyId}, Employee: ${training.employeeId}, Course: ${training.courseName}`
  )

  // TODO: 실제 구현
  // 1. 교육 이수 기록 저장
  // 2. 해당 직원의 스킬 레벨 업데이트 고려
  // 3. 다음 추천 교육 갱신
  // 4. 인증서 발급 처리

  await simulateAsyncOperation()

  console.log(`Successfully processed training completion: ${training.courseId}`)
}

// 비동기 작업 시뮬레이션
function simulateAsyncOperation(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 100))
}
