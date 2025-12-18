import React from 'react'

const paymentHandler = () => {
    const handlePay = async (sweet) => {
        await createPayment({
          amount: sweet.price,
          method: "upi"
        })
    };
  return (
    <div>
      
    </div>
  )
}

export default paymentHandler
