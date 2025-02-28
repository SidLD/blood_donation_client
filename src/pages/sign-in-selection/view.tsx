import { User } from 'lucide-react'
import logo from '../../assets/logo.png'
import { useEffect } from 'react'
import { auth } from '@/lib/services'

const SignInSelectionView: React.FC = () => {
    useEffect(() => {
        if(auth.getToken()){
            window.location.href = `${auth.getRole().toLowerCase()}`
        }
    }, [])
    return (
        <div className="w-full h-full bg-[#3D0000] rounded-3xl p-2 shadow-2xl flex-col items-center ">
            <div className="z-20 flex items-center text-white/90">
                <img width={60} src={logo} alt="logo" />
            </div>
            <div className="items-center justify-center min-h-[25rem] p-6 ">
                <h1 className="mb-8 text-2xl font-bold text-center text-white">
                LOGIN AS 
                </h1>
        
                <div className="flex flex-col items-center justify-center w-full gap-8">
                <a 
                    href="/login/admin"
                    className="flex items-center w-[75%] lg:w-[50%] gap-3 px-6 py-4 transition-colors bg-white rounded-lg hover:bg-white/90 group"
                >
                    <User className="w-6 h-6 text-[#3D0000]" />
                    <span className="text-[#3D0000] text-xl font-bold px-6">ADMIN</span>
                </a>
        
                <a 
                    href="/login/donor"
                    className="flex items-center w-[75%] md:w-[50%] gap-3 px-6 py-4 transition-colors bg-white rounded-lg hover:bg-white/90 group"
                >
                    <User className="w-6 h-6 text-[#3D0000]" />
                    <span className="text-[#3D0000] text-xl font-bold px-6">DONOR</span>
                </a>
                </div>
            </div>
        </div>
  )
}

export default SignInSelectionView
