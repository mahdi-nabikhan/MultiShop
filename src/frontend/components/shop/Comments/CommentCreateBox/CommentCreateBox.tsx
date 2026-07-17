"use client";

import React, { useState } from "react";
import "./CommentCreateBox.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BACKEND_URLS from "@/utils";

interface CommentCreateBoxProps {
  productId: string;
  parent?: number;
}

export default function CommentCreateBox({
  productId,
  parent,
}: CommentCreateBoxProps) {
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");

  const createCommentMutation = useMutation({
    mutationFn: async () => {
      const payload: {
        descriptions: string;
        parent?: number;
      } = {
        descriptions: comment,
      };

      if (parent !== undefined) {
        payload.parent = parent;
      }

      const response = await fetch(
        `${BACKEND_URLS}customer/api/v1/add/comment/${productId}/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      return response.json();
    },

    onSuccess: () => {
      setComment("");

      queryClient.invalidateQueries({
        queryKey: ["product-comments", productId],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!comment.trim()) return;

    createCommentMutation.mutate();
  };

  return (
    <form
      className="comment-create-box"
      onSubmit={handleSubmit}
    >
      <h2>
        {parent ? "Reply to Comment" : "Write a Comment"}
      </h2>

      <p className="description">
        {parent
          ? "Write your reply."
          : "Share your experience with this product."}
      </p>

      <textarea
        rows={6}
        placeholder={
          parent
            ? "Write your reply..."
            : "Write your comment..."
        }
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        type="submit"
        disabled={createCommentMutation.isPending}
      >
        {createCommentMutation.isPending
          ? "Submitting..."
          : parent
          ? "Submit Reply"
          : "Submit Comment"}
      </button>

      {createCommentMutation.isError && (
        <p className="error">
          Failed to submit.
        </p>
      )}

      {createCommentMutation.isSuccess && (
        <p className="success">
          Submitted successfully.
        </p>
      )}
    </form>
  );
}