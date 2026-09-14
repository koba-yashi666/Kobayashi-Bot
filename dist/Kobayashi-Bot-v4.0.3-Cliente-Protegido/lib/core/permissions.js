/* Kobayashi Protected Distribution v4.0.3 */
export const PERMISSION_LEVELS = Object.freeze({
  MEMBER: 0,
  PREMIUM: 1,
  ADMIN: 2,
  LEADER: 3,
  OWNER: 4,
});

export function createPermissions({
  sender,
  isGroup,
  groupAdmins = [],
  isMainOwner = false,
  isLeader = false,
  isPremium = false,
} = {}) {
  const isRealGroupAdmin =
    Boolean(isGroup) &&
    Array.isArray(groupAdmins) &&
    groupAdmins.includes(sender);

  let level = PERMISSION_LEVELS.MEMBER;

  if (isPremium) level = PERMISSION_LEVELS.PREMIUM;
  if (isRealGroupAdmin) level = PERMISSION_LEVELS.ADMIN;
  if (isLeader) level = PERMISSION_LEVELS.LEADER;
  if (isMainOwner) level = PERMISSION_LEVELS.OWNER;

  return {
    level,
    isMember: true,
    isPremium: level >= PERMISSION_LEVELS.PREMIUM,
    isAdmin: level >= PERMISSION_LEVELS.ADMIN,
    isLeader: level >= PERMISSION_LEVELS.LEADER,
    isOwner: level >= PERMISSION_LEVELS.OWNER,
    isRealGroupAdmin,
    can(required = PERMISSION_LEVELS.MEMBER) {
      return level >= required;
    },
  };
}

export function permissionName(level) {
  if (level >= PERMISSION_LEVELS.OWNER) return "\x44\x6f\x6e\x6f";
  if (level >= PERMISSION_LEVELS.LEADER) return "\x4c\xed\x64\x65\x72";
  if (level >= PERMISSION_LEVELS.ADMIN) return "\x41\x44\x4d";
  if (level >= PERMISSION_LEVELS.PREMIUM) return "\x50\x72\x65\x6d\x69\x75\x6d";
  return "\x4d\x65\x6d\x62\x72\x6f";
}
