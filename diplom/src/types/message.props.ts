export interface MessageProps {
  recipient_id: number;
  project_id: number;
  sender_id: number;
  status: string;
  text: string;
  id: number;
  hidden?: boolean;
}
