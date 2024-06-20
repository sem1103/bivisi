import React from 'react';
import { Link } from 'react-router-dom';
import left from '../../assets/icons/Left-Arrow.svg';
import './style.scss'

const Payment = () => {
    return (
        <div className='payment'>
            <div className="container-fluid">
                <div className="row">
                    <div className='col-lg-12 pt-4 payment_head pb-4'>
                        <Link to="/basket" ><img src={left} alt="left.icon" />Payment</Link>
                    </div>

                    <div className='col-lg-8 p-5'>
                        <div className='contact_info'>
                            <h4>1. Contact information</h4>
                        </div>

                        <div className='payment-form pt-3'>
                            <form>
                                <div className='row'>
                                    <div className='col-lg-6 '>
                                        <div className='d-flex flex-column'>
                                            <label>First name</label>
                                            <input type="text" className='mt-2' />
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className='d-flex flex-column'>
                                            <label>Second name</label>
                                            <input type="text" className='mt-2' />
                                        </div>
                                    </div>

                                </div>

                                <div className='row pt-3'>
                                    <div className='col-lg-6 '>
                                        <div className='d-flex flex-column'>
                                            <label>Phone number</label>
                                            <input type="number" className='mt-2' />
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className='d-flex flex-column'>
                                            <label>E-mail address</label>
                                            <input type="email" className='mt-2' />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>


                        <div className='payment_method pt-5'>
                            <h4>2. Shipping method</h4>
                        </div>

                        <div className='payment_info pt-5'>
                            <div className='col-lg-8'>
                                <div className='d-flex flex-column'>
                                    <label>Name on card</label>
                                    <input type="text" className='mt-2' placeholder='Zaire Rosser' />
                                </div>
                            </div>

                            <div className='col-lg-8 pt-4'>
                                <div className='d-flex flex-column'>
                                    <label>Card number</label>
                                    <input type="number" className='mt-2' placeholder='1234 5678 9102 3456' />
                                </div>
                            </div>

                            <div className="row pt-4">
                                <div className="col-lg-4">
                                    <div className='d-flex flex-column'>
                                        <label>Expiration date</label>
                                        <input type="text" className='mt-2' placeholder='02/24' />
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className='d-flex flex-column'>
                                        <label>CVC</label>
                                        <input type="text" className='mt-2' placeholder='123' />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='col-lg-4 p-5'>
                        <div className='payment-check'>
                            <p className='mb-0'>I agree your <span>Terms of use</span> and <span>Privacy Policy lorem ipsum dolor</span></p>
                        </div>

                        <div className='paymnet_summary mt-4'>
                            <div>
                                <h3 className='pb-3'>Summary</h3>
                                <div className='d-flex justify-content-between '>
                                    <p>Lorem ipsum dolor sit amet consectetur</p>
                                    <span>$ 1000</span>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <p>Lorem ipsum dolor sit amet consectetur</p>
                                    <span>$ 1000</span>
                                </div>

                                <hr />

                                <div className='d-flex justify-content-between py-3'>
                                    <p>Subtotal</p>
                                    <span>$ 10</span>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <p>Tax amount</p>
                                    <span>$ 10</span>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <p>Shipping cost</p>
                                    <span>$ 10</span>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <p>Discount 10%</p>
                                    <span>- $ 10</span>
                                </div>

                                <hr />

                                <div className='d-flex justify-content-between py-3 total_payment'>
                                    <p>Total amount</p>
                                    <span>$ 2000</span>

                                </div>
                                <Link>Pay</Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment