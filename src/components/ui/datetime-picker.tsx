import { useState, useEffect } from 'react'
import { Calendar, Clock, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn, toLocalISOString } from '@/lib/utils'

interface DateTimePickerProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  className?: string
  error?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  disabled = false,
  minDate,
  className,
  error = false
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate())
  const [selectedHour, setSelectedHour] = useState<number>(9) // Default to 9 AM
  const [selectedMinute, setSelectedMinute] = useState<number>(0)

  // Parse existing value when component mounts or value changes
  useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setSelectedMonth(date.getMonth() + 1)
        setSelectedDay(date.getDate())
        setSelectedHour(date.getHours())
        setSelectedMinute(date.getMinutes())
      }
    }
  }, [value])

  const currentYear = new Date().getFullYear()
  const daysInMonth = new Date(currentYear, selectedMonth - 1, 0).getDate()

  const formatDisplayValue = () => {
    if (!value) return placeholder
    
    const date = new Date(value)
    if (isNaN(date.getTime())) return placeholder
    
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    
    return `${month}/${day} ${hour}:${minute}`
  }

  const handleConfirm = () => {
    // Create date with current year and selected values
    const newDate = new Date(currentYear, selectedMonth - 1, selectedDay, selectedHour, selectedMinute)
    
    // Check if date is valid and not in the past (if minDate is set)
    if (minDate && newDate < minDate) {
      return // Don't allow past dates
    }
    
    onChange(newDate.toISOString())
    setIsOpen(false)
  }

  const handleCancel = () => {
    // Reset to current values
    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setSelectedMonth(date.getMonth() + 1)
        setSelectedDay(date.getDate())
        setSelectedHour(date.getHours())
        setSelectedMinute(date.getMinutes())
      }
    }
    setIsOpen(false)
  }

  const isDateInPast = () => {
    if (!minDate) return false
    const selectedDate = new Date(currentYear, selectedMonth - 1, selectedDay, selectedHour, selectedMinute)
    return selectedDate < minDate
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
          error && "border-destructive",
          className
        )}
        aria-label={`Date and time picker. Current value: ${formatDisplayValue()}`}
      >
        <Calendar className="mr-2 h-4 w-4" />
        {formatDisplayValue()}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1">
          <Card className="w-80 shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Select Date & Time
                </div>

                {/* Month and Day Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Month
                    </label>
                    <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value, 10))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => {
                          const month = i + 1
                          const monthName = new Date(currentYear, i, 1).toLocaleDateString('en-US', { month: 'short' })
                          return (
                            <SelectItem key={month} value={month.toString()}>
                              {String(month).padStart(2, '0')} - {monthName}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Day
                    </label>
                    <Select value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value, 10))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(daysInMonth)].map((_, i) => {
                          const day = i + 1
                          return (
                            <SelectItem key={day} value={day.toString()}>
                              {String(day).padStart(2, '0')}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Hour and Minute Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Hour
                    </label>
                    <Select value={selectedHour.toString()} onValueChange={(value) => setSelectedHour(parseInt(value, 10))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(24)].map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {String(i).padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Minute
                    </label>
                    <Select value={selectedMinute.toString()} onValueChange={(value) => setSelectedMinute(parseInt(value, 10))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 15, 30, 45].map((minute) => (
                          <SelectItem key={minute} value={minute.toString()}>
                            :{String(minute).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Preview */}
                <div className="text-center p-3 bg-muted rounded-md">
                  <div className="text-sm font-medium">
                    {String(selectedMonth).padStart(2, '0')}/{String(selectedDay).padStart(2, '0')} {String(selectedHour).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(currentYear, selectedMonth - 1, selectedDay, selectedHour, selectedMinute).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                {/* Validation Warning */}
                {isDateInPast() && (
                  <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                    Selected time is in the past. Please choose a future time.
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleConfirm}
                    disabled={isDateInPast()}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Confirm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay to close picker when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
