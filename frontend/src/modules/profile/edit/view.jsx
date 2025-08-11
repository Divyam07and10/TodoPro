import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Save, ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { Toaster } from "@/components/ui/sonner"

export default function EditProfileView({
  user,
  loading,
  submitting,
  formData,
  imagePreview,
  isPlaceholderImage,
  fileInputRef,
  handleSubmit,
  handleInputChange,
  handleImageUpload,
  handleRemoveImage,
}) {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile for edit...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600">Update your personal information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar key={imagePreview ? "with-image" : "without-image"} className="h-24 w-24">
                        {imagePreview ? (
                          <AvatarImage
                            src={imagePreview}
                            alt={user.name || "User Avatar"}
                            width={96}
                            height={96}
                          />
                        ) : (
                          <AvatarFallback className="bg-blue-500 text-white text-4xl font-semibold flex items-center justify-center">
                            {user.name ? user.name[0].toUpperCase() : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex space-x-3">
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </Button>
                        {imagePreview && (
                          <Button type="button" variant="outline" onClick={handleRemoveImage}>
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG or GIF (Max 2MB).
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500">{formData.bio.length}/200 characters</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Link href="/profile">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}