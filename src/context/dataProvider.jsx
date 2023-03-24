import { query, collection, getDocs, getDoc, doc } from "firebase/firestore";
import React, { createContext, useContext, useState } from "react";
import { useFirebase } from "./firebase";

const DataContext = createContext(undefined);

const DataProvider = ({ children }) => {
    const { firestore } = useFirebase()
    const [products, setProducts] = useState([])
    const [tags, setTags] = useState([])

    const loadProducts = () => (
        new Promise(async (resolve, reject) => {
            try {
                const p = (await getDocs(query(collection(firestore, "products")))).docs.map(doc => doc.data())
                const config = (await getDoc(doc(collection(firestore, "config"), "1"))).data()
                setProducts(p)
                setTags(config?.tags || [])
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    )
    return (
        <DataContext.Provider
            value={{
                allProducts: products,
                featured: products.filter(p => p.featured),
                frontpageProducts: products.filter(p => p.frontpage),
                tags,
                productsPerTag: tags.map(t => ({ [t]: products.filter(p => p.tags.includes(t)) })),
                loadProducts,
                searchProducts: e => e
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
        