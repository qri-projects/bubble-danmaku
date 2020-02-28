import Global = WebAssembly.Global;
import {MyProto} from "./MyProto";


interface MyGlobalD extends Global,MyProto{
}

export default MyGlobalD;
