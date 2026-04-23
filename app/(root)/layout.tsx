import Header  from "@/modules/home/header";
import  Footer  from "@/modules/home/footer";


export default function HomeLayout({
    children
}:{
    children:React.ReactNode
}){

    return(
        <>
        <Header/>
        {/*Background effect and asertanity grid */ }
        {/* main*/ }
        <Footer/>

        </>
    )
}