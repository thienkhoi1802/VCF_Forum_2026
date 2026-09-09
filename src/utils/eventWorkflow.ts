import { EventItem, ComputedEventStatus, RegistrationHistoryItem } from '../types';

/**
 * Suy ra trạng thái sự kiện theo Quy trình VCF (Mục 3):
 * IF now() > event.end_time:
 *     event.status = ENDED
 * ELSE IF event.registered_count >= event.capacity:
 *     event.status = FULL
 * ELSE:
 *     event.status = OPEN
 *
 * Lưu ý: ENDED được ưu tiên kiểm tra trước FULL.
 */
export function getComputedEventStatus(
  event: EventItem,
  simulatedState?: string
): ComputedEventStatus {
  // 1. Kiểm tra ENDED trước tiên
  if (event.status === 'past') {
    return 'ENDED';
  }

  // 2. Kiểm tra FULL
  if (
    simulatedState === 'S-FULL' ||
    event.isFull ||
    (event.totalSeats > 0 && event.availableSeats <= 0)
  ) {
    return 'FULL';
  }

  // 3. Mặc định là OPEN
  return 'OPEN';
}

/**
 * Kiểm tra xem email đã tồn tại trong hệ thống VCF hay chưa (Mục 4 - Bước 5)
 */
export const KNOWN_SYSTEM_EMAILS = [
  'ceo@vinasteel.com.vn',
  'hung.bt@lgm.edu.vn',
  'member@vcf.org.vn',
  'ceo@vietnamceo.org.vn',
  'duc.pham@vinasteel.com.vn'
];

export function checkEmailExists(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const normalized = email.trim().toLowerCase();
  return KNOWN_SYSTEM_EMAILS.some(known => known.toLowerCase() === normalized);
}

/**
 * SLA duyệt dự kiến từ Ban Thư ký VCF
 */
export const VCF_APPROVAL_SLA = 'Từ 24 đến 48 giờ làm việc';

/**
 * Ước tính thời hạn giữ chỗ Waitlist khi có suất trống
 */
export const VCF_WAITLIST_HOLD_HOURS = 24;
