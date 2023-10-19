import { useCallback, useState } from "react";
import InputBiography from "../../../components/Inputs/InputBio/InputBiography";
import { postCommentRequest } from "../../../requests";
import { ButtonBorder } from "../../../components/Buttons/ButtonBorder";

import './Comments.css'
import { useNavigate } from "react-router";

export default function Comments({ video }: any) {

    const navigate = useNavigate();
    const [commentValue, setCommentValue] = useState("")

    const sendComment = useCallback(async () => {
        if (video && video.imdb_code && video.imdb_code.trim() &&
            commentValue && commentValue.trim()) {
            postCommentRequest(video.imdb_code, commentValue.trim())
                .then((res: any) => { setCommentValue("") })
                .catch(() => { })
        }
    }, [video, commentValue]);

    return (
        <div className='comment-cast' >
            <h1>Comments</h1>
            <div style={{ height: '100%', display: 'fex', width: '400px' }}>
                <InputBiography
                    title='Add a comment'
                    value={commentValue}
                    setValue={setCommentValue}
                    maxLength={400}
                    placeholder='This film is . . .'
                />
                <ButtonBorder title="Post" onClick={() => sendComment()} />
            </div>
            {
                video && video.comments && video.comments.length > 0 &&
                video.comments.map((c: any) =>
                    <div key={c.id} className='comment'>
                        <p
                            className='font-14 comment-profile'
                            style={{ fontWeight: '400' }}
                            onClick={() => { navigate(`/profile/${c.userId}`) }}
                        >{c.username}</p>
                        <p className='font-14'>{c.text}</p>
                        <p className='font-12' style={{ opacity: '70%' }}>{new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                )
            }
        </div>
    )
}