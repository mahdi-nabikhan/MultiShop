"use client";

import React, { useState } from "react";
import "./CommentCreateBox.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BACKEND_URLS from "@/utils";

interface CommentCreateBoxProps {
  productId: string;
}

export default function CommentCreateBox({
  productId,
}: CommentCreateBoxProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const createCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${BACKEND_URLS}customer/api/v1/add/comment/${productId}/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            comment,
            rating,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      return response.json();
    },

    onSuccess: () => {
      setTitle("");
      setComment("");
      setRating(5);

      queryClient.invalidateQueries({
        queryKey: ["product-comments", productId],
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !comment.trim()) return;

    createCommentMutation.mutate();
  }

  return (
    <form className="comment-create-box" onSubmit={handleSubmit}>
      <h2>Write a Review</h2>

      <p className="description">
        Share your experience with this product.
      </p>

      <input
        type="text"
        placeholder="Review title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={5}>★★★★★ - Excellent</option>
        <option value={4}>★★★★☆ - Very Good</option>
        <option value={3}>★★★☆☆ - Good</option>
        <option value={2}>★★☆☆☆ - Fair</option>
        <option value={1}>★☆☆☆☆ - Poor</option>
      </select>

      <textarea
        rows={6}
        placeholder="Share your experience with this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        type="submit"
        disabled={createCommentMutation.isPending}
      >
        {createCommentMutation.isPending
          ? "Submitting..."
          : "Submit Review"}
      </button>

      {createCommentMutation.isError && (
        <p className="error">
          Failed to submit your review.
        </p>
      )}

      {createCommentMutation.isSuccess && (
        <p className="success">
          Your review has been submitted successfully.
        </p>
      )}
    </form>
  );
}