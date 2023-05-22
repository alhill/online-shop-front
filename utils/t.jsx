import { get } from 'lodash'

const t = (locale = "es", key) => {
    const locales = {
        addToCart: {
            "es": "Añadir al carro",
            "en": "Add to cart"
        },
        search: {
            "es": "Buscar",
            "en": "Search"
        },
        logToYourAccount: {
            "es": "Acceder a tu cuenta",
            "en": "Log into your account"
        },
        email: {
            "es": "Correo electrónico",
            "en": "Email"
        },
        password: {
            "es": "Contraseña",
            "en": "Password"
        },
        password2: {
            "es": "Confirmar contraseña",
            "en": "Repeat password"
        },
        cancel: {
            "es": "Cancelar",
            "en": "Cancel"
        },
        logIn: {
            "es": "Acceder",
            "en": "Log in"
        },
        createAccount: {
            "es": "Crear cuenta",
            "en": "Create account"
        },
        recoverPassword: {
            "es": "Recuperar contraseña",
            "en": "Recover password"
        },
        requiredField: {
            "es": "Campo requerido",
            "en": "Required field"
        },
        myCart: {
            "es": "Mi carro",
            "en": "Shopping cart"
        },
        continueShopping: {
            "es": "Continuar comprando",
            "en": "Continue shopping"
        },
        checkout: {
            "es": "Finalizar compra",
            "en": "Checkout"
        },
        emptyCart: {
            "es": "Tu cesta está vacía",
            "en": "Your cart is empty"
        },
        endRegister: {
            "es": "Finalizar registro",
            "en": "Register"
        },
        featuredProducts: {
            "es": "Productos destacados",
            "en": "Featured products"
        },
        relevance: {
            "es": "Relevancia",
            "en": "Relevance"
        },
        priceUp: {
            "es": "Precio ↗",
            "en": "Price ↗"
        },
        priceDn: {
            "es": "Precio ↘",
            "en": "Price ↘"
        },
        azUp: {
            "es": "Nombre ↗",
            "en": "Name ↗"
        },
        azDn: {
            "es": "Nombre ↘",
            "en": "Name ↘"
        },
        orderBy: {
            "es": "Orden",
            "en": "Order"
        },
        categories: {
            "es": "Categorias",
            "en": "Categories"
        }
    }

    return get(locales, [key, locale], key)
}

export default t