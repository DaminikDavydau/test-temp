import React from 'react'
import { appName } from '../../constants/constants'

function Footer() {
    return (
        <footer className="absolute bottom-0 left-0 w-full h-16 bg-BGdark_lightblue flex items-center justify-center">
            <p className="text-BGlight-white">© {appName}. All rights reserved.</p>
        </footer>
    )
}

export default Footer