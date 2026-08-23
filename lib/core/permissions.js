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
  if (level >= PERMISSION_LEVELS.OWNER) return "Dono";
  if (level >= PERMISSION_LEVELS.LEADER) return "Líder";
  if (level >= PERMISSION_LEVELS.ADMIN) return "ADM";
  if (level >= PERMISSION_LEVELS.PREMIUM) return "Premium";
  return "Membro";
}
