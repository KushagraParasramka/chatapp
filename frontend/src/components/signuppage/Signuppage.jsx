import React from 'react'
import Logobox from '../../utils/Logobox.jsx'
import Formbox from '../../utils/Formbox.jsx'

const Signuppage = () => {
  return (
    <div className='auth-page'>
        <Logobox />
        <Formbox
        usernameBoxB={true}
        fullnameBoxB={true}
        emailBoxB={true}
        passwordBoxB={true}
        signup={true}
        />
    </div>
  )
}

export default Signuppage
