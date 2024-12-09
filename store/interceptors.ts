import { baseServerURL } from "@/lib/utils";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: baseServerURL,
    withCredentials:true
})

axiosInstance.interceptors.request.use(
    async(config)=>{
        if(!axiosInstance.defaults.headers.common["X-CSRFToken"]){
            try{
               const {data} = await axios.get(`${baseServerURL}/sentinela/csrf/`, {
                withCredentials:true
               })
                axiosInstance.defaults.headers.common["X-CSRFToken"] = data?.csrfToken
            }catch(error){
                console.log(`Error fetching csrf token: ${error}`)
            }
        }

        config.headers["X-CSRFToken"] = axiosInstance.defaults.headers.common["X-CSRFToken"]
        
        // IN CASE YOU NEED TO SEND TOKEN IN THE FUTURE, THIS IS WHERE
        //TO RETRIEVE NEXTAUTH TOKEN AND SEND WITH REQUEST

        return config
    },
    (error) =>{
        return Promise.reject(error)
    }
)

export default axiosInstance