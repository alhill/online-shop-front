import { useEffect } from 'react'
import { useRouter } from 'next/router'

const useRedirect = to => {
    const router = useRouter()
    to = to || router.asPath
    
    // language detection
    useEffect(() => {

        const detectedLng = localStorage.getItem("lastLocale") || "es"
        if (to.startsWith('/' + detectedLng) && router.route === '/404') { // prevent endless loop
            router.replace('/' + detectedLng + router.route)
            return
        }
        
        // languageDetector.cache(detectedLng)
        router.replace('/' + detectedLng + to)
    })
    
    return <></>
};

// // eslint-disable-next-line react/display-name
// const getRedirect = (to) => () => {
//     useRedirect(to)
//     return <></>
// }

const Redirect = () => {
    useRedirect()
    return <></>
}

export default Redirect


