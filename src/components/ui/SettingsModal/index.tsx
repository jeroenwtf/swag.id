import { Tab } from '@headlessui/react'
import Modal from "@/components/ds/Modal";

import ProfileTab from './profileTab';
import AccountTab from './accountTab';

import clsx from 'clsx';
import { useProfileContext } from '@/store/profile-context';

export default function SettingsModal() {
  const { settingsModalIsShown, setSettingsModalIsShown } = useProfileContext()
  const sidebarTab = clsx('text-left pt-1.5 pb-2.5 px-4 ui-selected:bg-white -ml-4 -mr-6 rounded-l-md')
  const sidebarTabHint = clsx('text-gray-500 text-xs')
  const panelClasses = clsx('px-7 py-8')

  return (
    <Modal
      open={settingsModalIsShown}
      onClose={() => setSettingsModalIsShown(false)}
      size="large"
      withSidebar
    >
      <Tab.Group vertical>
        <div className="flex absolute inset-0">
          <Tab.List className="bg-gray-200 pl-8 pr-6 py-6 flex flex-col items-stretch w-64 shrink-0">
            <h2 className="font-bold mb-2">Settings</h2>
            <Tab className={sidebarTab}>
              Your profile
              <div className={sidebarTabHint}>Avatar, name, bio and url</div>
            </Tab>
            <Tab className={sidebarTab} disabled>
              Theme customization
              <div className={sidebarTabHint}>Coming soon</div>
            </Tab>
            <Tab className={sidebarTab} disabled>
              Social networks
              <div className={sidebarTabHint}>Coming soon</div>
            </Tab>
            <Tab className={sidebarTab}>
              Account
              <div className={sidebarTabHint}>E-mail, password, other providers</div>
            </Tab>
          </Tab.List>
          <Tab.Panels className="overflow-y-scroll">
            <Tab.Panel className={panelClasses}>
              <ProfileTab />
            </Tab.Panel>
            <Tab.Panel className={panelClasses}>Content 2</Tab.Panel>
            <Tab.Panel className={panelClasses}>Content 3</Tab.Panel>
            <Tab.Panel className={panelClasses}>
              <AccountTab />
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>
    </Modal>
  )
}
