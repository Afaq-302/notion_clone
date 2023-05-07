import React, { useState, useEffect } from "react";


export default function (url) {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const res = await fetch(uri);
                const json = await res.json();

                setData(json)
                setLoading(false)
            } catch {
                setError(error)
                setLoading(false)
            }

        }

        fetchData();
    })


    return { loading, error, data }
}
