import {auth} from '@/auth'

const DashboardPage = async () => {
    const session = await auth()
  return (
    <div>Hi {session?.user?.email}</div>
  )
}

export default DashboardPage