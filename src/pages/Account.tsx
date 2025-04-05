
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { User, Lock, Bell, CreditCard, Key, Shield } from "lucide-react";

const Account = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567"
  });

  const [notifications, setNotifications] = useState({
    paymentAlerts: true,
    balanceLow: true,
    newDevices: true,
    marketing: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    pinRequired: true,
    locationTracking: false
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
    });
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSecurityChange = (key: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast({
      title: "Security Settings Updated",
      description: "Your security settings have been updated.",
    });
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-rfid-blue mb-8">Account Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Lock className="mr-2 h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" /> Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={form.firstName} 
                        onChange={e => setForm({...form, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={form.lastName} 
                        onChange={e => setForm({...form, lastName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={form.email} 
                        onChange={e => setForm({...form, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={form.phone} 
                        onChange={e => setForm({...form, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-rfid-teal hover:bg-rfid-blue">Save Changes</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <Button type="submit" className="bg-rfid-teal hover:bg-rfid-blue">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactorAuth} 
                      onCheckedChange={() => handleSecurityChange("twoFactorAuth")} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">Require PIN for Payments</h4>
                      <p className="text-sm text-gray-500">Require your PIN for all transactions.</p>
                    </div>
                    <Switch 
                      checked={securitySettings.pinRequired} 
                      onCheckedChange={() => handleSecurityChange("pinRequired")} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">Location Tracking</h4>
                      <p className="text-sm text-gray-500">Allow location tracking for fraud prevention.</p>
                    </div>
                    <Switch 
                      checked={securitySettings.locationTracking} 
                      onCheckedChange={() => handleSecurityChange("locationTracking")} 
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Security Quick Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="flex items-center border-red-200 text-red-600 hover:bg-red-50">
                        <Shield className="mr-2 h-4 w-4" /> Lock All Cards
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <Key className="mr-2 h-4 w-4" /> Change PIN
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Login History</CardTitle>
                <CardDescription>Recent account activity.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">Web Browser - Chrome</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Today, 10:42 AM</p>
                      <p className="text-xs text-gray-500">192.168.1.1</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <p className="font-medium">Mobile App</p>
                      <p className="text-sm text-gray-500">iPhone 12</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Yesterday, 6:30 PM</p>
                      <p className="text-xs text-gray-500">Mobile Network</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Web Browser</p>
                      <p className="text-sm text-gray-500">Firefox</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">April 2, 2025</p>
                      <p className="text-xs text-gray-500">192.168.1.1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how we communicate with you.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">Payment Alerts</h4>
                      <p className="text-sm text-gray-500">Receive notifications for all transactions.</p>
                    </div>
                    <Switch 
                      checked={notifications.paymentAlerts} 
                      onCheckedChange={() => handleNotificationChange("paymentAlerts")} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">Low Balance Alerts</h4>
                      <p className="text-sm text-gray-500">Get notified when your balance falls below $10.</p>
                    </div>
                    <Switch 
                      checked={notifications.balanceLow} 
                      onCheckedChange={() => handleNotificationChange("balanceLow")} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">New Device Login</h4>
                      <p className="text-sm text-gray-500">Alert when your account is accessed from a new device.</p>
                    </div>
                    <Switch 
                      checked={notifications.newDevices} 
                      onCheckedChange={() => handleNotificationChange("newDevices")} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">Marketing & Promotions</h4>
                      <p className="text-sm text-gray-500">Receive news, updates and special offers.</p>
                    </div>
                    <Switch 
                      checked={notifications.marketing} 
                      onCheckedChange={() => handleNotificationChange("marketing")} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage payment methods for adding funds.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/27</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm font-medium text-gray-500">Default</span>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={18} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-red-600 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">MC</div>
                      <div>
                        <p className="font-medium">Mastercard ending in 5678</p>
                        <p className="text-sm text-gray-500">Expires 08/26</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal size={18} />
                    </Button>
                  </div>
                  
                  <Button className="w-full bg-rfid-teal hover:bg-rfid-blue mt-4">
                    <CreditCard className="mr-2 h-4 w-4" /> Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Auto Top-up Settings</CardTitle>
                <CardDescription>Configure automatic reloads for your cards.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-medium">Enable Auto Top-up</h4>
                      <p className="text-sm text-gray-500">Automatically add funds when balance is low.</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Balance Threshold</Label>
                    <Input id="threshold" type="number" placeholder="10.00" disabled />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="topupAmount">Top-up Amount</Label>
                    <Input id="topupAmount" type="number" placeholder="50.00" disabled />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select 
                      id="paymentMethod" 
                      className="w-full h-10 px-3 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                      disabled
                    >
                      <option>Visa ending in 4242</option>
                      <option>Mastercard ending in 5678</option>
                    </select>
                  </div>
                  
                  <Button className="w-full" disabled>
                    Save Auto Top-up Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
