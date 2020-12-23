# File Structure

| 파일이름 |                                          의미                                           |
| -------- | :-------------------------------------------------------------------------------------: |
| `@ ...`  |             Global Module 혹은 앱을 실행시키는 데에 있어서 필수적인 Module              |
| `# ...`  |     Module 이지만 Graphql Query ( resolver를 가지지 않는 ) / util성향이 강한 module     |
| `$ ...`  | Nest Module이 아닌 즉, 단순히 import만 이용해서 사용하는 함수들 혹은 클래스에 대한 폴더 |
| `...`    |                        graphql query ( resolver 를 가진 ) module                        |

# Core

- [x] user
- [x] post
- [x] like
- [x] comment
- [x] subscription
- [x] redis

# Rules

- [x] 클래스에서 private 변수들에 대한 이름은 맨 앞에 '\_'을 붙인다.
- [x] 환경변수들(env)에 대한 설정은 configModule에서 진행하고 해당 변수들을 사용할 때는 반드시 해당 모듈을 이용하여 접근한다 (config Module외의 모듈에서는 직접적으로 process.env 사용하지 않기)
- [x] GraphQL return type은 따로 class 를 정의하여 사용 (prisma 에서 만들어준 model interface를 implement)
- [x] resolver 함수에 대한 return type은 prisma가 만들어준 model interface 를 사용

# Comment

- [x] 대댓글까지만 기능 구현

# subscription

- [x] 게시물에 좋아요 버튼을 누르면 게시물을 작성한 자에게 subscription
- [x] 댓글을 달 때, 어떠한 유저를 tag하면 해당 유저에게 subscription ('@' tag를 단 유저들에게만 알림이 날라간다.)

# Notification

- [x] publish 를 할 경우, notification row 를 생성 -> checked: false
- [x] user subscription가 열려있을 경우 -> 해당 notification checked : true
  - 닫혀있을 경우 -> checked 는 false
  - notifyToUser subscription Then 로직을 탈 경우 checked 가 true 가 된다.

# TDD

- [ ] Unit Test
- [ ] Integration Test
