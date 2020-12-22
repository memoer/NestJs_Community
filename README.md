# File Structure

- Global Module, 앱을 실행시키는 데에 있어서 필수적인 Module -> 모듈 이름 앞에 '\_'을 붙인다.
- Nest Module이 아닌 즉, 단순히 import만 이용해서 사용하는 함수들 혹은 클래스에 대한 코드가 위치한 폴더는 이름 앞에 '\$'을 붙인다.

# Core

- [x] user
- [x] post
- [x] like
- [x] comment
- [x] subscription
- [x] redis

# Rules

- [x] GraphQL return type은 models 로 정의된 class를 사용
- [x] resolver 함수에 대한 return type은 prisma가 만들어준 interface 를 사용

# Comment

- [x] 대댓글까지만 기능 구현

# subscription

- [x] 게시물에 좋아요 버튼을 누르면 게시물을 작성한 자에게 subscription
- [ ] 댓글을 달 때, 어떠한 유저를 tag하면 해당 유저에게 subscription

# redis

- redis + notification -> 알람

# TDD

- [ ] Unit Test
- [ ] Integration Test
