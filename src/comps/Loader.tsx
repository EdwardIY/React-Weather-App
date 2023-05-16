interface LoaderProps {
    loading: Boolean
}

export default function Loader({ loading }: LoaderProps) {

    return <>
        { loading && <div className="loader">
                        <div></div><div></div><div></div><div></div>
                    </div>
        }
    </>  

}