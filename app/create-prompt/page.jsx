"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Form from "@components/Form";
import { useRouter } from "next/navigation";

const CreatePrompt = () => {

	const [submitting, setSubmitting] = useState(false);
	const [post, setPost] = useState({
		prompt: '',
		tag: ''
	});
	const router = useRouter();
	const {data: session} = useSession(); // meaning we are deconstructing the data and rename it as a session.

	const createPrompt = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			const response = await fetch('/api/prompt/new', {
				method: 'POST',
				body: JSON.stringify({
					prompt: post.prompt,
					userId: session?.user.id,
					tag: post.tag
				})
			})

			if(response.ok) {
				router.push('/')
			}

		} catch (error) {
			console.log(error)
		} finally {
			setSubmitting(false)
		}

	}

  return (
    <Form 
			type="Create"
			post={post}
			setPost={setPost}
			submitting={submitting}
			handleSubmit={createPrompt}
		/>
  )
}

export default CreatePrompt