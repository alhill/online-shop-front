import { Container } from "../components"
import { useRouter } from 'next/router'

const FourOhFour = () => {
    const router = useRouter()
    
    let l = (typeof window !== 'undefined' && localStorage.getItem("lastLocale")) || (router.asPath.includes("/en/") ? "en" : "es")

    return (
        <Container l={l || "es"}>
            <h2>404</h2>
            <p style={{ textAlign: "center" }}>{ l === "en" ? "The page you are trying to access does not exist" : "La página a la que intentas acceder no existe" }</p>
        </Container>
    )
}

export default FourOhFour
