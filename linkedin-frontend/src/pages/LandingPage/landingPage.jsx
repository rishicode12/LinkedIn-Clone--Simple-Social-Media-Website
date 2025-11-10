import React from "react";
import { Link} from "react-router-dom";
import GoogleLogin from "../../components/GoogleLogin/googleLogin";

const LandingPage = () => {
  return (
    <div className="my-4 py-[50px] md:pl-[120px] px-5 md:flex justify-between">
      <div className="md:w-[40%]">
        <div className="text-4xl mx-auto text-gray-500">Welcome To Your Professional Community</div>

        <div className="mx-auto mt-2 w-[70%]">
          <GoogleLogin />
        </div>

        <Link to={'/login'} className="flex mx-auto mt-2 px-4 py-3 bg-white gap-2 rounded-lg items-center w-[70%] justify-center text-black hover:bg-gray-100 border-2 cursor-pointer text-base font-medium h-[44px]">Sign in with email</Link>

        <div className="text-center text-xs text-gray-500 mt-4">
          By clicking Continue to join or sign in, you agree to LinkedIn's <br />
          <a href="#" className="text-blue-500 hover:underline">User Agreement</a>, 
          <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>, and 
          <a href="#" className="text-blue-500 hover:underline">Cookie Policy</a>.
        </div>

        <div className="text-center mt-6 mb-4">
          <Link to={'/signUp'} className="text-lg">
            New to LinkedIn? <span className="text-blue-800 font-bold hover:underline">Join now</span>
          </Link>
        </div>

      </div>
      <div className="md:w-[50%]">
        <img src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png" alt="image" />
      </div>
    </div>
  )
}

export default LandingPage