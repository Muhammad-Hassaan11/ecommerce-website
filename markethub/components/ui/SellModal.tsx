'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Tag, Upload, Send } from 'lucide-react'
import { notifyToast } from './Toast'
import { saveUserProduct, fileToDataUrl } from '@/lib/utils/userProducts'
import styles from './SellModal.module.css'

interface SellModalProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Art',
  'Digital Goods',
]

export default function SellModal({ isOpen, onClose }: SellModalProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ---------- Lock body scroll ---------- */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* ---------- Escape key ---------- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  /* ---------- Click outside ---------- */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  /* ---------- File handling ---------- */
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }, [])

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  /* ---------- Drag events ---------- */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  /* ---------- Reset form ---------- */
  const resetForm = () => {
    setName('')
    setPrice('')
    setCategory('')
    setDescription('')
    removeImage()
  }

  /* ---------- Submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // basic validation
    if (!name.trim() || !price.trim() || !category) {
      notifyToast('Please fill in all required fields.', 'error')
      return
    }

    let imageDataUrl: string | null = null
    if (imageFile) {
      try {
        imageDataUrl = await fileToDataUrl(imageFile)
      } catch {
        notifyToast('Failed to process image. Listing will be created without an image.', 'error')
      }
    }

    saveUserProduct({
      name: name.trim(),
      price: parseFloat(price),
      category,
      description: description.trim(),
      imageDataUrl,
    })

    notifyToast('Listing created successfully! 🎉', 'success')
    resetForm()
    onClose()
  }

  /* ---------- Cleanup preview URL on unmount ---------- */
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} ref={modalRef} role="dialog" aria-modal="true" aria-label="Sell a product">

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleIcon}>
              <Tag size={18} strokeWidth={2.2} />
            </span>
            List a Product
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.body}>

            {/* Product Name */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="sell-name">
                Product Name <span className={styles.required}>*</span>
              </label>
              <input
                id="sell-name"
                type="text"
                className={styles.input}
                placeholder="e.g., Wireless Headphones"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            {/* Price + Category side-by-side */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="sell-price">
                  Price (USD) <span className={styles.required}>*</span>
                </label>
                <input
                  id="sell-price"
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  placeholder="29.99"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="sell-category">
                  Category <span className={styles.required}>*</span>
                </label>
                <select
                  id="sell-category"
                  className={styles.select}
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="sell-desc">Description</label>
              <textarea
                id="sell-desc"
                className={styles.textarea}
                placeholder="Describe your product..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className={styles.field}>
              <label className={styles.label}>Product Image</label>
              {imagePreview ? (
                <div className={styles.preview}>
                  <img src={imagePreview} alt="Preview" className={styles.previewImg} />
                  <button type="button" className={styles.previewRemove} onClick={removeImage} aria-label="Remove image">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={28} className={styles.dropzoneIcon} />
                  <p className={styles.dropzoneText}>
                    Drag & drop an image here, or{' '}
                    <span className={styles.dropzoneBrowse}>browse</span>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.dropzoneHidden}
                    onChange={handleFileInput}
                    tabIndex={-1}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              <Send size={16} />
              Submit Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
