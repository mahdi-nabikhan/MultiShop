import React from 'react'
import { MessageCircle } from 'lucide-react'

type User = {
    id:number;
    email:string;

}
type Comment = {
    id:number,
    description :string,
    status : string,
    customer:User,
    product:number,
    parent: number | null
}
type Props = {
    comment :Comment
}

function CommentCard({comment}:Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    {comment.customer.email[0].toUpperCase()}
                </div>

                <div>
                    <h3 className="font-medium">
                        {comment.customer.email}
                    </h3>

                    <span className="text-sm text-gray-500">
                        کاربر
                    </span>
                </div>

            </div>

            {/* Body */}

            <p className="mt-4 leading-7 text-gray-700">
                {comment.description}
            </p>

            {/* Footer */}

            <div className="mt-5 flex justify-end">

                <button className="flex items-center gap-2 rounded-lg border px-4 py-2 transition hover:bg-gray-100">
                    <MessageCircle size={18} />
                    پاسخ
                </button>

            </div>
        </div>
    
  )
}

export default CommentCard