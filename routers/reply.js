import { Router } from 'express'
import * as reply from '../controllers/reply.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

// 創建新的回報（需登入）
router.post('/', auth.jwt, reply.create)

// 取得所有回報（需登入，並且是管理員）
router.get('/all', auth.jwt, auth.admin, reply.getAll)

// 取得單一回報資訊（需登入）
router.get('/:id', auth.jwt, reply.getById)

// 更新回報狀態（需登入，管理員才能修改）
router.patch('/:id', auth.jwt, auth.admin, reply.updateStatus)

// // 刪除回報（可選，若不允許刪除則可移除）
// router.delete('/:id', auth.jwt, auth.admin, reply.delete)

// 測試用的 GET /reply，確保這個路由存在
router.get('/', (req, res) => {
  res.send('Hello from /reply!')
})

export default router
