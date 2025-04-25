import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const OtpVerify = () => {
    const [otpcode, setOtpcode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const findOtp = () => {
        let a = ""
        for (let i = 0; i < 6; i++) {
            a = a + otpcode[i]
        }
        return a
    }
    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // Chỉ cho nhập số

        const updatedOtp = [...otpcode];
        updatedOtp[index] = value;
        setOtpcode(updatedOtp);

        // Auto focus sang ô kế tiếp nếu đã nhập xong 1 ký tự
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (index > 0) {
            if (e.key === 'Backspace') {
                if (otpcode[index] === '') {
                    // Nếu ô hiện tại đã rỗng thì focus về ô trước
                    const prevInput = document.getElementById(`otp-${index - 1}`);
                    if (prevInput) prevInput.focus();
                }
                else {
                    otpcode[index] = ''
                }
            }
        }
    };



    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true)
        let otp = findOtp()
        const username = localStorage.getItem("register_username");
        const data = {
            "username": username, "otp": otp
        }
        if (otp.length !== 6) {
            setError("Vui lòng nhập đủ 6 chữ số OTP.");
            return;
        }
        axios
            .post('http://localhost:5000/verify-otp', data)
            .then(() => {
                setLoading(false);
                localStorage.removeItem("register_username");
                navigate('/login'); // Điều hướng về trang chính sau khi đăng nhập thành công
            })
            .catch((error) => {
                setLoading(false);
                if (error.response && error.response.data && error.response.data.error) {
                    setError(error.response.data.error);
                } else {
                    setError('An error occurred. Please try again.');
                }
            });

    }
    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
            <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        <div className="font-semibold text-3xl">
                            <p>Email Verification</p>
                        </div>
                        <div className="flex flex-row text-sm font-medium text-gray-400">
                            <p>We have sent a code to your email</p>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}  {/* Hiển thị lỗi */}
                    <div>
                        <form action="#" onSubmit={handleVerify}>
                            <div className="flex flex-col space-y-16">
                                <div className="flex flex-row items-center justify-between mx-1 w-full ">
                                    <div className="w-16 h-16 ">
                                        <input maxLength="1" value={otpcode[0]}
                                            onChange={(e) => handleOtpChange(e, 0)} className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="otp-0" />
                                    </div>
                                    <div className="w-16 h-16 ">
                                        <input maxLength="1" value={otpcode[1]}
                                            onChange={(e) => handleOtpChange(e, 1)} onKeyDown={(e) => handleKeyDown(e, 1)} className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="otp-1" />
                                    </div>
                                    <div className="w-16 h-16 ">
                                        <input maxLength="1" value={otpcode[2]}
                                            onChange={(e) => handleOtpChange(e, 2)} onKeyDown={(e) => handleKeyDown(e, 2)} className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="otp-2" />
                                    </div>
                                    <div className="w-16 h-16 ">
                                        <input maxLength="1" value={otpcode[3]}
                                            onChange={(e) => handleOtpChange(e, 3)} onKeyDown={(e) => handleKeyDown(e, 3)} className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="otp-3" />
                                    </div>
                                    <div className="w-16 h-16 ">
                                        <input maxLength="1" value={otpcode[4]}
                                            onChange={(e) => handleOtpChange(e, 4)} onKeyDown={(e) => handleKeyDown(e, 4)} className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="otp-4" />
                                    </div>
                                    <div className="w-16 h-16 ">
                                        <input maxLength="1" value={otpcode[5]}
                                            onChange={(e) => handleOtpChange(e, 5)} onKeyDown={(e) => handleKeyDown(e, 5)} className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="otp-5" />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-5">
                                    <div>
                                        <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                                            Verify Account
                                        </button>
                                    </div>

                                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                        <p>Didn't recieve code?</p> <a className="flex flex-row items-center text-blue-600" href="http://" target="_blank" rel="noopener noreferrer">Resend</a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default OtpVerify