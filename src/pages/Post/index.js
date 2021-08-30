import "./dist/index.css"
import React from 'react'
import { getCommentsByArticleId, getArticles, getArticleById } from '../../fake-api'
import {getYMDHMS} from '../../utils'



export default class Post extends React.Component{

    state={
        postId:this.props.match.params.id
    }



    render(){
        return (
            <>
                <PostContent postId={this.state.postId}></PostContent>   
                <CommentContent postId={this.state.postId}></CommentContent>
            </>
        )
    }
}

class PostContent extends React.Component{

    state = {
        content:"",
        postInfo:{},
        authorInfo:{}
    }

    rememberHistory = ()=>{
        let storage = window.localStorage;
        if(storage.getItem("historyID")===null){
            storage.setItem("historyID",JSON.stringify([]))
        }
        let curData = JSON.parse(storage.getItem("historyID"))
        if(curData.indexOf(this.props.postId) !== -1){
            curData.splice(curData.indexOf(this.props.postId),1)
        }
        let newData = [this.props.postId,...curData]
        localStorage.setItem("historyID",JSON.stringify(newData))
    }

    async getArticleById(){
        const data = await getArticleById(this.props.postId)
        const article = data.data.article
        this.setState({content:article.article_content,
                        postInfo:article.article_info,
                        authorInfo:article.author_user_info
        })
    }

    componentDidMount(){
        this.getArticleById()
        this.rememberHistory()
    }
    ts2date = ts=>getYMDHMS(parseInt(ts)*1000) 
    render(){
        return (<div className="article-container">
            <div className="article-info-box">
                <img src={this.state.authorInfo.avatar_large} alt="" className="avatar" />
                <div className="text-info">
                    <div className="text">
                        <span className="name">{this.state.authorInfo.user_name}</span>
                        <span className="time">{this.ts2date(this.state.postInfo.ctime)} 阅读 {this.state.postInfo.view_count}</span>
                    </div>
                    <button className="subscribe">关注</button>
                </div>
            </div>
            <img src={this.state.postInfo.cover_image} alt="" className="article-img"/>
            <h1 className="article-title">{this.state.postInfo.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
        </div>)
    }
}

class CommentContent extends React.Component{

    state = {
        comments:[],
        hasMore:true,
        offset:0,
        limit:5,
        total:0
    }
    getComment = async (offset,limit)=>{

        const data = await getCommentsByArticleId(this.props.postId,offset,limit)
        this.setState({
            comments:data.data.comments,
            total:data.total,
            hasMore:data.has_more
        })
    }

    componentDidMount(){
        this.getComment()
    }

    getRestComment = () => {
        this.getComment(this.state.limit, this.state.total);
    }
    renderText = ()=>{
        if(this.state.hasMore)
            return (
                    <>
                        查看全部{this.state.total - this.state.limit}条评论⇩
                    </>
                )
        else 
            return (
            <>
                到底啦～～～
            </>
        )
    }
    render(){
        return (<div className="comment-container">   
            <div className="comment-header">全部评论（{this.state.total}）</div>
            <div className="comment-list">
                {this.state.comments.map(item=>
                    <Comment key={item.comment_id} comment={item}></Comment>
                )}
            </div>
            <div className="show-more" onClick={this.getRestComment} >
                {this.renderText()}
            </div>
        </div>)
    }
}

class Comment extends React.Component{
    userInfo = this.props.comment.user_info
    commentInfo = this.props.comment.comment_info
    replyInfo = this.props.comment.reply_infos
    ts2date = ts =>getYMDHMS(parseInt(ts)*1000)
    render(){
        return (<div className="comment">
            <img src={this.userInfo.avatar_large} alt="" className="user-image"/>
            <div className="user-info">
                <div className="comment-user-header">
                    <span className="user-name">{this.userInfo.user_name}</span>
                    <span className="divide"></span>
                    <span className="user-time">{this.ts2date(this.commentInfo.ctime)}</span>
                </div>
                <div className="comment-content">
                    {this.commentInfo.comment_content}
                    {this.replyInfo.map(item=>
                        <ChildComment key={item.reply_id} childComment={item}></ChildComment>
                    )}
                </div>
                <div className="comment-icons">
                    <i className="iconfont icon-thumb"><span>{this.commentInfo.digg_count===0?"点赞":this.commentInfo.digg_count}</span></i>
                    <i className="iconfont icon-comment"><span>{this.commentInfo.reply_count===0?"评论":this.commentInfo.reply_count}</span></i>
                </div>
            </div>

        </div>)
    }
}
class ChildComment extends React.Component{

    userInfo = this.props.childComment.user_info
    commentInfo = this.props.childComment.reply_info
    render(){
        return (<div className="child-comment">
            <img src={this.userInfo.avatar_large} alt="" className="user-image"/>
            <div className="user-info">
                <div className="comment-user-header">
                    <span className="user-name">{this.userInfo.user_name}</span>
                </div>
                <div className="comment-content">
                    {this.commentInfo.reply_content}
                </div>
                <div className="comment-icons">
                    <i className="iconfont icon-thumb"><span>{this.commentInfo.digg_count===0?"点赞":this.commentInfo.digg_count}</span></i>
                    <i className="iconfont icon-comment"><span>{this.commentInfo.reply_count===0?"评论":this.commentInfo.reply_count}</span></i>
                </div>
            </div>

        </div>)
    }
}