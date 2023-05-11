import React from 'react';
import "./Comments.css"

// @ts-ignore
import picture from "../../static/picture.png"
// @ts-ignore
import nt from "../../static/329ccc2cdedbc10415445cb6f80c93.jpg@2x.png"
// @ts-ignore
import giveLike from "../../static/giveLike.png"


class Comments extends React.Component <any> {
    state = {
        showElem: "none",
        Spread: "展开更多回复"
    }

    showMore() {
        const showElem = this.state.showElem
        if (showElem === "none") {
            this.setState({
                showElem: "block",
                Spread: "更多回复"
            })

        } else {
            this.setState({
                showElem: "none",
                Spread: "展开更多回复"
            })
        }
    };


    render() {
        return <div className="c1Comment">
            <div className="character">
                <img src={picture} alt=""/>
                <div className="message">
                    <span>Yihannn</span>
                    <span>2023年3月24日 &nbsp; 16:33 &nbsp; 来自广东</span>
                </div>
            </div>
            <div className="article">
                <span>推荐的女性友好医院？什么大家有没有推荐的女性友好医院？推荐的女性友好医院？什么大家有没有推荐的女性友好医院？</span>
                <span className={"c1hand"}>#附近女生拍了拍你</span>
                <img src={nt} alt=""/>
            </div>
            <div className="Action">
                <img className={"c1hand"} src={giveLike} alt=""/>
                <div>18</div>
                <div className={"c1hand"}>评论</div>
            </div>
            <span className={"c1hand"} onClick={this.showMore.bind(this)}>{this.state.Spread}&nbsp;(9)</span>
            {/*    展开更多回复*/}
            <div className={"c1More"} style={{display: this.state.showElem}}>
                <div className={"top"}>
                    <img src={giveLike} alt=""/>
                    <div className={"nameTime"}>
                        <div className={"name"}>skuromi</div>
                        <div className={"time"}>2023年3月30日 &nbsp; 11:34 &nbsp; 来自广东</div>
                    </div>
                </div>

                <div className={"moreComments"}>看起来真不错！点赞</div>
            </div>
            <div onClick={this.showMore.bind(this)} className="c1Putaway c1hand"
                 style={{display: this.state.showElem}}>收起
            </div>
        </div>
    }
}

export default Comments;
