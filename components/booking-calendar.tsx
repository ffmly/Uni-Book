"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Sun, Moon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Types
type Sport = "basketball" | "handball" | "football"
type TimeOfDay = "morning" | "afternoon"

interface TimeSlot {
  id: string
  time: string
  period: TimeOfDay
  enabled: boolean
}

interface Stadium {
  id: string
  name: string
  sportId: Sport
  enabled: boolean
}

interface BookingCalendarProps {
  userId: string
}

export default function BookingCalendar({ userId }: BookingCalendarProps) {
  const { t, language } = useLanguage()
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedStadium, setSelectedStadium] = useState<string | null>(null)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{
    morning: TimeSlot[]
    afternoon: TimeSlot[]
  }>({
    morning: [],
    afternoon: [],
  })
  const [availableStadiums, setAvailableStadiums] = useState<Stadium[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - in a real app, this would come from the API
  const sports: { id: Sport; name: string; imageSrc: string }[] = [
    {
      id: "basketball",
      name: t("sports.basketball"),
      imageSrc: "/images/basketball.png",
    },
    {
      id: "handball",
      name: t("sports.handball"),
      imageSrc: "/images/handball.png",
    },
    {
      id: "football",
      name: t("sports.football"),
      imageSrc: "/images/football.png",
    },
  ]

  // Generate dates for the next 4 days
  useEffect(() => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 4; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(format(date, "yyyy-MM-dd"))
    }

    setAvailableDates(dates)
  }, [])

  // When sport and date are selected, fetch available time slots
  useEffect(() => {
    if (selectedSport && selectedDate) {
      // In a real app, this would be an API call
      // For now, we'll simulate with mock data
      setAvailableTimeSlots({
        morning: [
          { id: "1", time: "08:00", period: "morning", enabled: true },
          { id: "2", time: "09:00", period: "morning", enabled: true },
          { id: "3", time: "10:00", period: "morning", enabled: false },
        ],
        afternoon: [
          { id: "4", time: "14:00", period: "afternoon", enabled: true },
          { id: "5", time: "15:00", period: "afternoon", enabled: false },
          { id: "6", time: "16:00", period: "afternoon", enabled: true },
        ],
      })

      // Fetch available stadiums for the selected sport
      // In a real app, this would be an API call
      const stadiums: Stadium[] = [
        {
          id: "1",
          name: `${t("sports." + selectedSport)} ${language === "ar" ? "الملعب 1" : "Stadium 1"}`,
          sportId: selectedSport,
          enabled: true,
        },
        {
          id: "2",
          name: `${t("sports." + selectedSport)} ${language === "ar" ? "الملعب 2" : "Stadium 2"}`,
          sportId: selectedSport,
          enabled: true,
        },
      ]

      setAvailableStadiums(stadiums)
    }
  }, [selectedSport, selectedDate, t, language])

  const handleBooking = async () => {
    if (!selectedSport || !selectedDate || !selectedTime || !selectedStadium) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description:
          language === "ar"
            ? "يرجى اختيار الرياضة والتاريخ والوقت والملعب"
            : "Please select sport, date, time and stadium",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful booking
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const stadium = availableStadiums.find((s) => s.id === selectedStadium)

      toast({
        title: language === "ar" ? "تم الحجز بنجاح" : "Booking Successful",
        description:
          language === "ar"
            ? `تم حجز ${stadium?.name} يوم ${format(new Date(selectedDate), "EEEE d MMMM", { locale: ar })} الساعة ${selectedTime}`
            : `Booked ${stadium?.name} on ${format(new Date(selectedDate), "EEEE, MMMM d")} at ${selectedTime}`,
      })

      // Reset selections
      setSelectedTime(null)
      setSelectedStadium(null)
    } catch (error) {
      toast({
        title: language === "ar" ? "فشل الحجز" : "Booking Failed",
        description:
          language === "ar"
            ? "حدث خطأ أثناء محاولة الحجز. يرجى المحاولة مرة أخرى."
            : "An error occurred while trying to book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDay = (dateString: string) => {
    const date = new Date(dateString)
    const dayName = format(date, "EEE", { locale: language === "ar" ? ar : undefined })
    const dayNumber = format(date, "d")
    return { dayName, dayNumber }
  }

  // Get the current selected sport for the header icon
  const getCurrentSportImage = () => {
    if (!selectedSport) return null
    const sport = sports.find((s) => s.id === selectedSport)
    return sport?.imageSrc
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            {selectedSport ? (
              <div className="h-5 w-5 relative">
                <Image
                  src={getCurrentSportImage() || "/images/basketball.png"}
                  alt={selectedSport}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <Calendar className="h-5 w-5 text-primary" />
            )}
          </div>
          <h2 className="text-xl font-semibold">{t("booking.chooseSport")}</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {sports.map((sport) => (
            <Card
              key={sport.id}
              className={cn(
                "cursor-pointer transition-all hover:bg-primary/5",
                selectedSport === sport.id ? "bg-primary text-primary-foreground" : "bg-primary/10",
              )}
              onClick={() => setSelectedSport(sport.id)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="relative h-16 w-16">
                  <Image src={sport.imageSrc || "/placeholder.svg"} alt={sport.name} fill className="object-contain" />
                </div>
                <span className="mt-2 text-center">{sport.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {selectedSport && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{t("booking.chooseDate")}</h2>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {availableDates.map((date) => {
              const { dayName, dayNumber } = formatDay(date)
              return (
                <Button
                  key={date}
                  variant={selectedDate === date ? "default" : "outline"}
                  className="flex h-auto flex-col py-3"
                  onClick={() => setSelectedDate(date)}
                >
                  <span>{dayName}</span>
                  <span className="text-2xl font-bold">{dayNumber}</span>
                </Button>
              )
            })}
          </div>
        </section>
      )}

      {selectedSport && selectedDate && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t("booking.timeSlots")}</h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">{t("booking.morning")}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableTimeSlots.morning
                  .filter((slot) => slot.enabled)
                  .map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      className="text-lg"
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      {slot.time}
                    </Button>
                  ))}
                {availableTimeSlots.morning.filter((slot) => slot.enabled).length === 0 && (
                  <div className="col-span-3 text-center py-2 text-muted-foreground">
                    {language === "ar" ? "لا توجد أوقات متاحة في الفترة الصباحية" : "No available morning time slots"}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-5 w-5 text-indigo-500" />
                <h3 className="font-medium">{t("booking.afternoon")}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableTimeSlots.afternoon
                  .filter((slot) => slot.enabled)
                  .map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      className="text-lg"
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      {slot.time}
                    </Button>
                  ))}
                {availableTimeSlots.afternoon.filter((slot) => slot.enabled).length === 0 && (
                  <div className="col-span-3 text-center py-2 text-muted-foreground">
                    {language === "ar"
                      ? "لا توجد أوقات متاحة في فترة ما بعد الظهر"
                      : "No available afternoon time slots"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedSport && selectedDate && selectedTime && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">{language === "ar" ? "اختر الملعب" : "Select Stadium"}</h2>

          <div className="grid grid-cols-2 gap-4 mt-2">
            {availableStadiums.map((stadium) => (
              <Card
                key={stadium.id}
                className={cn(
                  "cursor-pointer transition-all hover:bg-primary/5",
                  selectedStadium === stadium.id ? "bg-primary text-primary-foreground" : "bg-primary/10",
                )}
                onClick={() => setSelectedStadium(stadium.id)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <span>{stadium.name}</span>
                  {stadium.enabled ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      {language === "ar" ? "متاح" : "Available"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                      {language === "ar" ? "غير متاح" : "Unavailable"}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Button className="mt-8 w-full py-6 text-lg" disabled={!selectedStadium || isLoading} onClick={handleBooking}>
            {isLoading ? t("booking.booking") : t("booking.bookNow")}
          </Button>
        </section>
      )}
    </div>
  )
}

