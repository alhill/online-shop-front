import { query, collection, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import React, { createContext, useContext, useState } from "react";
import { useFirebase } from "./firebase";
import { useAuthentication } from "./authentication";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const { firestore } = useFirebase()
    const { user } = useAuthentication()
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState({ items: [], total: 0})
    const [tags, setTags] = useState([])
    const [cartModal, setCartModal] = useState(false)

    const loadProducts = () => (
        new Promise(async (resolve, reject) => {
            try {
                const p = (await getDocs(query(collection(firestore, "products")))).docs.map(doc => ({ ...doc.data(), id: doc.id }))
                const config = (await getDoc(doc(collection(firestore, "config"), "1"))).data()
                setProducts(p.filter(it => it.active))
                setTags(config?.tags || [])
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    )

    const mutateCart = async (slug, delta) => {
        const itemToAdd = products.find(it => it.slug === slug || it.id === slug)
        const actualCartItem = (cart?.items || []).find(it => it.slug === slug) || {
            slug: itemToAdd?.slug || itemToAdd?.id,
            id: itemToAdd?.id,
            price: itemToAdd.price,
            discountedPrice: itemToAdd.discountedPrice,
            name: itemToAdd.name,
            qty: 0
        }
        const items = [
            ...cart.items.filter(it => it.slug !== slug),
            {
                slug,
                id: actualCartItem.id,
                name: actualCartItem.name,
                qty: (actualCartItem?.qty || 0) + delta,
                price: actualCartItem.price,
                discountedPrice: actualCartItem.discountedPrice
            }
        ].filter(it => it.qty > 0)
        const total = items.reduce((acc, it) => acc + (it.qty * (it.discountedPrice || it.price)), 0)

        const newCart = { items, total }
        setCart(newCart)

        localStorage.setItem("lastCart", JSON.stringify(newCart))
        if(user){
            try{ //SAVE IN DATABASE CART STATUS
                await updateDoc(doc(firestore, "users", user.uid), { lastCart: newCart })
            } catch(err) {
                console.log(err)
            }
        }
    }

    const forceSetCart = cart => setCart(cart)

    return (
        <AppContext.Provider
            value={{
                allProducts: products,
                featured: products.filter(p => p.featured),
                frontpageProducts: products.filter(p => p.frontpage),
                tags,
                productsPerTag: tags.map(t => ({ [t]: products.filter(p => p.tags.includes(t)) })),
                loadProducts,
                searchProducts: e => e,
                cart,
                mutateCart,
                forceSetCart,
                cartModal,
                setCartModal
            }}
        >
            {children}
        </AppContext.Provider>
    );

};
    
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};

        