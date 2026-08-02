"use client";

import "./Paginations.css";

interface PaginationProps{

    next:string | null;

    previous:string | null;

    loading?:boolean;

    onNext:()=>void;

    onPrevious:()=>void;

}

export default function Pagination({

    next,

    previous,

    loading=false,

    onNext,

    onPrevious

}:PaginationProps){

    return(

        <div className="pagination-container">

            <button

                className="pagination-btn"

                disabled={!previous || loading}

                onClick={onPrevious}

            >

                ← Previous

            </button>


            <button

                className="pagination-btn"

                disabled={!next || loading}

                onClick={onNext}

            >

                Next →

            </button>

        </div>

    );

}