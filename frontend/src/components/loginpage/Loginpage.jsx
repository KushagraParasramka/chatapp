import React from 'react'
import Logobox from '../../utils/Logobox.jsx'
import Formbox from '../../utils/Formbox.jsx'

const Loginpage = () => {
  return (
    <div className='auth-page'>
        <Logobox />
        <Formbox
        emailBoxB={true}
        passwordBoxB={true}
        signup={false}
        />
    </div>
  )
}

export default Loginpage
