import { query, collection, getDocs, getDoc, doc } from "firebase/firestore";
import React, { createContext, useContext, useState } from "react";
import { useFirebase } from "./firebase";

const DataContext = createContext(undefined);

const DataProvider = ({ children }) => {
    const { firestore } = useFirebase()
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState({ items: [], total: 0})
    const [tags, setTags] = useState([])
    const [cartModal, setCartModal] = useState(false)

    const loadProducts = () => (
        new Promise(async (resolve, reject) => {
            try {
                const p = (await getDocs(query(collection(firestore, "products")))).docs.map(doc => doc.data())
                const config = (await getDoc(doc(collection(firestore, "config"), "1"))).data()
                setProducts(p.filter(it => it.active))
                setTags(config?.tags || [])
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    )

    const mutateCart = (slug, delta) => {
        const itemToAdd = products.find(it => it.slug === slug)
        const actualCartItem = (cart?.items || []).find(it => it.slug === slug) || {
            slug: itemToAdd?.slug,
            price: itemToAdd.price,
            name: itemToAdd.name,
            qty: 0
        }
        const items = [
            ...cart.items.filter(it => it.slug !== slug),
            {
                slug,
                name: actualCartItem.name,
                qty: (actualCartItem?.qty || 0) + delta,
                price: actualCartItem.price
            }
        ].filter(it => it.qty > 0)
        const total = items.reduce((acc, it) => acc + (it.qty * it.price), 0)

        setCart({ items, total })
    }

    return (
        <DataContext.Provider
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
                cartModal,
                setCartModal
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
    
const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};
    
export { DataProvider, useData };
        