# CRUD WEB
간단한 웹 게시판을 구현했습니다.
<br/><br/>

## 프로젝트 소개
간단한 Front-End QNA 게시판으로, 글을 등록, 수정, 삭제할 수 있다.  
<br/>
 
<img width="348" alt="crudweb_img" src="https://github.com/yulmukim/react_CRUD_WEB/assets/73217281/73bb8672-e814-4e9e-ae2d-adb036a9fca2">

Home 화면
<br/><br/>

<img width="298" alt="crudweb_img2" src="https://github.com/yulmukim/react_CRUD_WEB/assets/73217281/0ce10035-4d22-427e-a62c-4deeb7e0864e">

QNA list에서 content를 선택하면 수정, 삭제가 가능하다.
<br/><br/>

### App.js
```js
if (mode === 'WELCOME'){ // 첫 화면
    content = <Article title="Welcome" body="Feel free to ask questions"></Article>
  } else if (mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li className='ul_list_2'><a href={"/update"+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}><HiStar /> 수정</a></li>
      <li className='ul_list_3'><input className='delete_btn' type="button" value="삭제" onClick= {()=>{
        const newTopics = []
        for (let i=0; i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }}/></li>
    </>
  } else if (mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if (mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for (let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
```
WELCOME, READ, CREATE, UPDATE로 mode를 나눠서 조건문을 작성함.
<br/><br/>
1. WELCOME mode는 Home 화면이다. <br/><br/>
2. READ mode는 본문 내용을 읽을 수 있는 mode이다. 목록에서 누른 content를 띄운다. 수정 기능, 삭제 기능은 Home 화면에는 보일 필요 없기 때문에 content에서만 나타나게 설정한다. <br/><br/>
3. CREATE mode에서는 작성한 내용을 목록과 content에 띄우게 설정한다. -> useState를 사용해서 변경된 내용을 저장시켜준다. <br/><br/>
4. UPDATE mode에서는 기존의 title, body값을 가져와서 그 내용을 기반으로 수정할 수 있도록, 마찬가지로 useState를 사용한다. <br/><br/>


## 컴포넌트
```js
// 제목 Component
function Header(props){ 
  return <header>
  <h1 className='header_'><a className="header-title" href="/" onClick={(event)=>{
    event.preventDefault();
    props.onChangeMode();
  }}>{props.title}</a></h1>
</header>
}
```
제목 컴포넌트 Header <br/><br/>
```js
// QNA 리스트 메뉴 Component
function Nav(props){ 
  const lis = [
    // <li><a href="/read/1">html</a></li>,
    // <li><a href="/read/2">css</a></li>,
    // <li><a href="/read/3">js</a></li>
  ]
  for(let i=0; i<props.topics.length; i++){ // 반복문 이용하여 topics 객체 배열 갖고 오기
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id)); // 문자를 숫자로 변환(id)
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
  <ol className='ol_style'>
   {lis}
  </ol>
</nav>
}
```
QNA 리스트 메뉴 컴포넌트 Nav <br/><br/>
```js
// 본문 내용 Component
function Article(props){ 
  return <article className='article_'>
  <h2 className='content_title'>{props.title}</h2>
  {props.body}
</article>
}
```
본문 내용 컴포넌트 Article <br/><br/>

### Create, Update
```js
function Create(props){ // Create
  return <article className='create_article'>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault(); // page가 reload되는 것을 막기 위함
      const title = event.target.title.value; // 사용자가 입력한 제목 전달 받음
      const body = event.target.body.value;  // 사용자가 입력한 내용 전달 받음
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p> 
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input className="create_btn" type="submit" value="Create"></input></p> 
    </form>
  </article>
}
```
Create 기능 구현 <br/><br/>
```js
function Update(props) { // Update
  const [title, setTitle] = useState(props.title); // title state 만들기
  const [body, setBody] = useState(props.body); // body state 만들기
  return <article className='update_article'>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input className='update_btn' type="submit" value="Update"></input></p>
    </form>
  </article>
}
```
Update 기능 구현
