"use client";


import {useEffect,useState} from "react";

import axios from "axios";

import {
    MessageCircle,
    Edit,
    Trash
} from "lucide-react";


import BACKEND_URLS from "@/utils";


import EditCommentModal from "../EditCommentModal/EditCommentModal";

import DeleteCommentModal from "../DeleteCommentModal/DeleteCommentModal";


import "./CustomerCommentDetail.css";




interface Comment {


    id:number;

    descriptions:string;

    status:string;

    user:{
        email:string
    };

    product:number;

    parent:number|null;


}





interface Props {


    commentId:number;


}





export default function CustomerCommentDetail({

    commentId

}:Props){



const [comment,setComment]=useState<Comment|null>(null);


const [openEdit,setOpenEdit]=useState(false);


const [openDelete,setOpenDelete]=useState(false);






const GetComment=async()=>{


    try{


        const {data}=await axios.get<Comment>(


            `${BACKEND_URLS}customer/api/v1/detail/comment/${commentId}/`,


            {

                withCredentials:true

            }


        );


        setComment(data);



    }

    catch(error){

        console.log(error);

    }


};






useEffect(()=>{


    GetComment();


},[commentId]);







if(!comment){


return <div>

Loading...

</div>


}







return (


<section className="comment-detail">





<div className="comment-detail-header">


<h2>

Comment Details

</h2>


<div>


<button

className="edit-btn"

onClick={()=>setOpenEdit(true)}

>

<Edit size={18}/>

Edit

</button>




<button

className="delete-btn"

onClick={()=>setOpenDelete(true)}

>

<Trash size={18}/>

Delete

</button>


</div>



</div>







<div className="comment-detail-card">



<div className="comment-detail-icon">

<MessageCircle size={40}/>

</div>





<div>


<h3>

Product #{comment.product}

</h3>



<p>

{comment.descriptions}

</p>




<div className="comment-status">


Status:

{

comment.status==="C"

?

" Approved"

:

" Pending"

}


</div>



<span>

{comment.user.email}

</span>



</div>





</div>







<EditCommentModal

open={openEdit}

close={()=>setOpenEdit(false)}

comment={comment}

refresh={GetComment}

/>





<DeleteCommentModal

open={openDelete}

close={()=>setOpenDelete(false)}

commentId={comment.id}

/>







</section>


);


}