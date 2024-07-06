import { useDispatch, useSelector } from "react-redux"
import { Form, useNavigate } from "react-router-dom"
import { forgetPasswordSendNewPass, updateErrorForgotPassword, updateMessageForgotPassword, updateNewPassForgotPassword, updateReNewPassForgotPassword } from "../../state/ForgetPasswordSlice";
import { useEffect } from "react";

function ForgetPasswordNewPass() {
  const forgetPasswordState = useSelector(state => state.forgetPassword)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleNewPassInputChange = (event) => {
    dispatch(updateNewPassForgotPassword(event.target.value))
  }

  const handleReNewPassInputChange = (event) => {
    dispatch(updateReNewPassForgotPassword(event.target.value))
  }

  const handleNewPassSubmit = (event) => {
    event.preventDefault();

    if (forgetPasswordState.data.newPass === "" || forgetPasswordState.data.newRePass === "") {
      dispatch(updateErrorForgotPassword(true));
      dispatch(updateMessageForgotPassword("Form Tidak Boleh Kosong"));
      return
    }

   

    if (forgetPasswordState.data.newPass != forgetPasswordState.data.reNewPass) {
      dispatch(updateErrorForgotPassword(true));
      dispatch(updateMessageForgotPassword("Password Tidak Sesuai"));
      return
    }

    

    if ([...forgetPasswordState.data.newPass].length < 6 || [...forgetPasswordState.data.reNewPass].length < 6) {
      dispatch(updateErrorForgotPassword(true));
      dispatch(updateMessageForgotPassword("Panjang Password Tidak Sesuai"));
      return
    }

    const prepData = {
      code: forgetPasswordState.data.code,
      email: forgetPasswordState.data.email,
      newPass: forgetPasswordState.data.newPass,
      reNewPass: forgetPasswordState.data.reNewPass
    }
    dispatch(forgetPasswordSendNewPass(prepData)).then(result => {
      
      if (!result.error) {
        document.getElementById('forgetPassword_success_modal').showModal()
        setTimeout(()=>{
          document.getElementById('forgetPassword_success_modal').close()
          navigate("/login");
        }, 5000)
      }
    })
  }

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (forgetPasswordState.error) {
  //       dispatch(updateErrorForgotPassword(false))
  //     }
  //   }, 5000)
  //   return () => clearTimeout(timer)
  // }, [forgetPasswordState.error])
  return (
    <Form onSubmit={handleNewPassSubmit} className="card-body items-center">
      <h2 className="text-[2em] font-semibold text-center text-[#4AAE64]">UBAH KATA SANDI</h2>
      {
        forgetPasswordState.error && (
          <div role="alert" className="alert alert-warning transition-all ease-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{forgetPasswordState.message}</span>
          </div>
        )
      }
      <label className="input border-none w-full max-w-96 flex items-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">
        <input onChange={handleNewPassInputChange} type="password" minLength={6} className="w-full" placeholder="Kata Sandi Baru" />
      </label>
      <label className="input border-none w-full max-w-96 flex items-center gap-2 before:bg-black relative before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0">

        <input onChange={handleReNewPassInputChange} type="password" minLength={6} className="w-full" placeholder="Konfirmasi Kata Sandi Baru" />
        <span className="material-symbols-outlined">
          verified_user
        </span>
      </label>


      <div className="card-actions justify-center w-full p-4">
        <button type="submit" className="btn rounded-full w-full max-w-80 bg-[#4AAE64] text-white hover:text-black" disabled={forgetPasswordState.loading}>
          <span className={forgetPasswordState.loading ? "loading loading-spinner" : ""}></span>
          UBAH KATA SANDI
        </button>
      </div>
    </Form>
  )
}

export default ForgetPasswordNewPass