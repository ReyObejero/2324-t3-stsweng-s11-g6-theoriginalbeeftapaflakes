import axios from 'axios';

const instance = axios.create({
    baseURL: `https://2324-t3-stsweng-s11-g6-theoriginalbeeftapaflakes-bpekbxjy5.vercel.app/`,
    withCredentials: true,
});

export default instance;
