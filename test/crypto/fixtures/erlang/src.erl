-module(ecdsa_secp256k1).
-export([create_fixtures/0]).
-include_lib("public_key/include/public_key.hrl").
-define(SigUpperBound, binary:decode_unsigned(<<16#7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0:256>>)).
-define(SigDiv, binary:decode_unsigned(<<16#FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141:256>>)).

create_fixtures() ->
    {PrivateKey, PublicKey} = generate_key_secp256k1(),
    write_jwk(PrivateKey),
    Msg = crypto:strong_rand_bytes(2048),
    file:write_file("./fixtures/msg.bin", Msg),
    Signature_DER = sign(Msg, PrivateKey),
    file:write_file("./fixtures/sig.der", Signature_DER),
    write_raw_sig(Signature_DER),
    ECPoint = #'ECPoint'{point=PublicKey},
    PK = {ECPoint, {namedCurve, secp256k1}},
    public_key:verify(Msg, sha256, Signature_DER, PK).

sign(Msg, PrivKey) ->
    Sig = public_key:sign(
		Msg,
		sha256,
		PrivKey
	),
    correct_low_s(Sig).

write_raw_sig(Der) ->
    {_, R, S} = public_key:der_decode('ECDSA-Sig-Value', Der),
    RBin = int_to_bin(R),
    SBin = int_to_bin(S),
    file:write_file("./fixtures/sig.bin", <<RBin/binary, SBin/binary>>).

write_jwk({_, _, PrivBytes, _, PubBytes, _}) ->
    <<4:8, XY/binary>> = PubBytes,
    <<X:32/binary, Y:32/binary>> = XY,
    JX = base64url:encode(X),
    JY = base64url:encode(Y),
    JD = base64url:encode(PrivBytes),
    PrivateJWK = jsx:encode(#{<<"kty">> => <<"EC">>, <<"crv">> => <<"secp256k1">>, <<"d">> => JD}),
    PublicJWK = jsx:encode(#{<<"kty">> => <<"EC">>, <<"crv">> => <<"secp256k1">>, <<"x">> => JX, <<"y">> => JY}),
    file:write_file("./fixtures/pk.json", PublicJWK),
    file:write_file("./fixtures/sk.json", PrivateJWK).

generate_key_secp256k1() ->
    PrivateKey = public_key:generate_key({namedCurve, secp256k1}),
    {_, _, _, _, PubBytes, _} = PrivateKey,
    {PrivateKey, PubBytes}.

int_to_bin(X) when X < 0 -> int_to_bin_neg(X, []);
int_to_bin(X) -> int_to_bin_pos(X, []).

int_to_bin_pos(0,Ds=[_|_]) ->
	list_to_binary(Ds);
int_to_bin_pos(X,Ds) ->
	int_to_bin_pos(X bsr 8, [(X band 255)|Ds]).

int_to_bin_neg(-1, Ds=[MSB|_]) when MSB >= 16#80 ->
	list_to_binary(Ds);
int_to_bin_neg(X,Ds) ->
	int_to_bin_neg(X bsr 8, [(X band 255)|Ds]).

correct_low_s(Sig) ->
    {_, R, S} = public_key:der_decode('ECDSA-Sig-Value', Sig),
    case S =< ?SigUpperBound of
        true ->
            Sig;
        false ->
            public_key:der_encode('ECDSA-Sig-Value', #'ECDSA-Sig-Value'{ r = R, s = ?SigDiv - S })
    end.
