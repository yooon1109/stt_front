![설명](/public/스크린샷%202024-09-10%20111538.png)
![설명](/public/스크린샷%202024-09-09%20153048.png)
![설명](/public/스크린샷%202024-09-09%20153346.png)
![설명](/public/스크린샷%202024-09-09%20154224.png)
![설명](/public/스크린샷%202024-09-09%20154422.png)

speakerEdit.jsx
drag and drop
/>> textfield의 값이 바뀔때마다 spkList도 바껴서 글자 하나 입력할때마다 자꾸 리렌더링이 됨
/>> textfield의 값은 tempValue로 따로 관리해서 입력후 textfield에서 포커스 아웃될때 spkList와 동기화
