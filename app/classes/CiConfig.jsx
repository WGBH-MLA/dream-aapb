export default function CiConfig(props){
  if(!props.ciAPIHost || !props.ciWorkspaceId || !props.ciUser || !props.ciPassword || !props.ciClientId || !props.ciClientSecret){
    throw "an abolute fit (bad ci config)!!"
  }

  return {
    ciAPIHost: ciAPIHost,
    ciWorkspaceId: ciWorkspaceId,
    ciUser: ciUser,
    ciPassword: ciPassword,
    ciClientId: ciClientId,
    ciClientSecret: ciClientSecret,
  }
}
