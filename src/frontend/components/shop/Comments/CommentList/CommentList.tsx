import React from 'react'
import CommentCard from '../CommentCard/CommentCard'
import BACKEND_URLS from '@/utils'
import axios from 'axios'


async function CommentList({productID}:{productID:number|string}) {
    const {data:comments} = await axios.get(
        `${BACKEND_URLS}customer/api/v1/all/products/comments/${productID}/`,
        {withCredentials:true})


  return (
    <>
    <div className="felx flex-col gap-6">
        {comments.map((comment:any)=>(
            <CommentCard key={comment.id}
                comment = {comment}
                />
        ))}
    </div>
    </>
  )
}

export default CommentList