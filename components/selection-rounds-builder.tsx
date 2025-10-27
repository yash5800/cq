"use client"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Round {
  id: string
  roundName: string
  startDate: string
  daysGap: number
}

interface SelectionRoundsBuilderProps {
  rounds: Round[]
  onRoundsChange: (rounds: Round[]) => void
}

export default function SelectionRoundsBuilder({ rounds, onRoundsChange }: SelectionRoundsBuilderProps) {
  const addRound = () => {
    const newRound: Round = {
      id: Date.now().toString(),
      roundName: "",
      startDate: "",
      daysGap: 0,
    }
    onRoundsChange([...rounds, newRound])
  }

  const removeRound = (id: string) => {
    if (rounds.length > 1) {
      onRoundsChange(rounds.filter((r) => r.id !== id))
    }
  }

  const updateRound = (id: string, field: keyof Round, value: any) => {
    onRoundsChange(
      rounds.map((r) =>
        r.id === id
          ? {
              ...r,
              [field]: field === "daysGap" ? Number.parseInt(value) || 0 : value,
            }
          : r,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Rounds Container */}
        <div className="space-y-4">
          {rounds.map((round, index) => (
            <div key={round.id} className="relative">
              {/* Connecting Wire */}
              {index < rounds.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-12 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-400/50"></div>
              )}

              {/* Round Card */}
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Round {index + 1}</h3>
                  </div>
                  {rounds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRound(round.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  )}
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Round Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                      Round Name *
                    </label>
                    <Input
                      type="text"
                      value={round.roundName}
                      onChange={(e) => updateRound(round.id, "roundName", e.target.value)}
                      placeholder="e.g., Online Test, Technical Round 1"
                      className="border-slate-300 dark:border-slate-600 text-sm"
                    />
                  </div>

                  {/* Start Date (only for first round) */}
                  {index === 0 && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                        Start Date *
                      </label>
                      <Input
                        type="date"
                        value={round.startDate}
                        onChange={(e) => updateRound(round.id, "startDate", e.target.value)}
                        className="border-slate-300 dark:border-slate-600 text-sm"
                      />
                    </div>
                  )}

                  {/* Days Gap */}
                  {index < rounds.length - 1 && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                        Days to Next Round
                      </label>
                      <Input
                        type="number"
                        value={round.daysGap}
                        onChange={(e) => updateRound(round.id, "daysGap", e.target.value)}
                        placeholder="e.g., 3, 7"
                        min="0"
                        className="border-slate-300 dark:border-slate-600 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Round Button */}
        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            onClick={addRound}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Round
          </Button>
        </div>
      </div>
    </div>
  )
}
