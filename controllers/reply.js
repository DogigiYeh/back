import { StatusCodes } from 'http-status-codes'
import Reply from '../models/reply.js'
import validator from 'validator'

// 創建回報
export const create = async (req, res) => {
  try {
    const { userId, name, description } = req.body

    // 確保所有欄位都有提供
    if (!userId || !name || !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'missingFields',
      })
    }

    // 創建新的回報
    const result = await Reply.create({
      userId,
      name,
      description,
      status: 'pending', // 預設狀態為待確認
      reportedAt: new Date(),
      fixedAt: null, // 尚未修復
    })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

// 取得所有回報
export const getAll = async (req, res) => {
  try {
    const result = await Reply.find()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'serverError',
    })
  }
}

// 取得單一回報
export const getById = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    // 透過 `id` 查詢回報
    const result = await Reply.findById(req.params.id).orFail(new Error('NOT FOUND'))
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'replyIdInvalid',
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'replyNotFound',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'serverError',
      })
    }
  }
}

// 更新回報狀態
export const updateStatus = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    const { status } = req.body

    // 限制 status 只能是這三種
    if (!['pending', 'confirmed', 'closed'].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'invalidStatus',
      })
    }

    const updateData = { status }
    if (status === 'closed') {
      updateData.fixedAt = new Date() // 設定修復時間
    }

    const result = await Reply.findByIdAndUpdate(req.params.id, updateData, {
      runValidators: true,
      new: true,
    }).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'replyIdInvalid',
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'replyNotFound',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'serverError',
      })
    }
  }
}
